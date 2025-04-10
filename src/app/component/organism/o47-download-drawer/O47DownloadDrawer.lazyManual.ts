import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O47DownloadDrawerTransitionController from './O47DownloadDrawerTransitionController';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C46MediaList from '../../block/c46-media-list/C46MediaList.lazy';
import { POPUP } from 'app/util/overlayActionTypes';
import { getComponentForElement } from 'muban-core';
import { O25PopupMessageContentProps } from '../o25-popup-message-content/O25PopupMessageContent.types';

import './o47-download-drawer.scss';

const lazyO25Template = () =>
  import(
    '../../organism/o25-popup-message-content/o25-popup-message-content.hbs?include'
  ) as LoadTemplateImport<O25PopupMessageContentProps>;

export default class O47DownloadDrawer extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o47-download-drawer';
  public readonly transitionController: O47DownloadDrawerTransitionController;

  private readonly clearButton = this.getElement('[data-clear-button');
  private readonly downloadAllButton = this.getElement('[data-download-all-button');
  private drawerCountMessage = this.getElement('[data-count-message]');
  private mediaList: C46MediaList | null = null;

  private dataArray: Array<string> = [];
  private isDrawerOpen: boolean = false;

  private popupCopy: O25PopupMessageContentProps | null = null;
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
    // styles for this overlay component are lazy loaded, so display: none is set on the html to hide it
    this.element.style.display = 'block';
    this.transitionController = new O47DownloadDrawerTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();

    this.addEventListeners();

    const mediaListElement = this.app.getElement(`[data-component="${C46MediaList.displayName}"]`);
    if (mediaListElement) {
      this.mediaList = getComponentForElement<C46MediaList>(mediaListElement);
    }
  }

  private addEventListeners() {
    this.clearButton &&
      this.addDisposableEventListener(this.clearButton, 'click', () => this.clearDownloadDrawer());

    this.downloadAllButton &&
      this.addDisposableEventListener(this.downloadAllButton, 'click', () =>
        this.onDownloadClick(),
      );
  }

  public handleData(
    content: string,
    pushToArray: boolean,
    popupCopy?: O25PopupMessageContentProps,
  ) {
    if (pushToArray) {
      this.dataArray.push(content);
    } else {
      this.dataArray.splice(this.dataArray.indexOf(content), 1);
    }

    if (popupCopy) this.popupCopy = popupCopy;
    this.updateCountMessage();

    if (this.dataArray.length >= 1) {
      if (this.isDrawerOpen) return;
      this.toggleDownloadDrawer(true);
    } else {
      this.toggleDownloadDrawer(false);
    }
  }

  private async onDownloadClick() {
    if (this.app === null) throw new Error('App was not found');
    if (!this.popupCopy) throw new Error('Popup Copy not found');

    const data = { content: this.popupCopy, mediaArray: this.dataArray };
    const [template, overlay] = await Promise.all([lazyO25Template(), this.app.overlay]);

    await overlay.dispatchAction({
      type: POPUP.STANDARD_DYNAMIC,
      payload: {
        template: template.default,
        data,
      },
    });
  }

  private updateCountMessage(): void {
    if (!this.drawerCountMessage) throw new Error('Drawer count message not found');

    const { message } = this.drawerCountMessage.dataset;
    const messageData = message && JSON.parse(message);

    this.dataArray.length <= 1
      ? (this.drawerCountMessage.innerHTML = messageData.selectedDownload.replace(
          '${count}',
          String(this.dataArray.length),
        ))
      : (this.drawerCountMessage.innerHTML = messageData.selectedDownloads.replace(
          '${count}',
          String(this.dataArray.length),
        ));
  }

  public clearDownloadDrawer() {
    if (this.app === null) throw new Error('App was not found');
    this.dataArray = [];

    this.updateCountMessage();
    this.toggleDownloadDrawer(false);

    if (this.mediaList) {
      this.mediaList.clearCheckboxes();
    }
  }

  private async toggleDownloadDrawer(open: boolean) {
    // In case open() fires before adopted() fulfils.
    // This is possible since we are lazy loading overlay related components.
    if (!this.app) {
      this.app = await getAppComponent();
    }
    if (this.app === null) throw new Error('App was not found');

    if (open) {
      this.transitionIn();
      this.isDrawerOpen = true;
    } else {
      this.transitionOut();
      this.isDrawerOpen = false;
    }
  }
}
