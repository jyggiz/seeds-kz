import AbstractComponent from 'app/component/AbstractComponent';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import C46MediaList from '../../block/c46-media-list/C46MediaList.lazy';
import { getComponentForElement } from 'muban-core';
import { POPUP } from 'app/util/overlayActionTypes';

import './o25-popup-message-content.scss';
export default class O25PopupMessageContent extends AbstractComponent {
  public static readonly displayName: string = 'o25-popup-message-content';

  private readonly popupButtons = this.getElement('[data-popup-buttons]');
  private readonly agreeTermsButton = this.getElement('[data-agree-terms]');
  private readonly closeTermsButton = this.getElement('[data-close-terms]');
  private mediaList: C46MediaList | null = null;

  private dataArray: Array<string> = [];
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.closeTermsButton &&
      this.addDisposableEventListener(this.closeTermsButton, 'click', this.onClosePopup.bind(this));

    this.agreeTermsButton &&
      this.addDisposableEventListener(this.agreeTermsButton, 'click', this.onAgreeTerms.bind(this));
  }

  public async adopted() {
    this.app = await getAppComponent();

    const mediaListElement = this.app.getElement(`[data-component="${C46MediaList.displayName}"]`);
    if (mediaListElement) {
      this.mediaList = getComponentForElement<C46MediaList>(mediaListElement);
    }
  }

  public onAgreeTerms(): void {
    if (!this.app) throw new Error('The app component cannot be found');
    if (!this.popupButtons) throw new Error('Popup buttons cannot be found');

    const { mediaData } = this.popupButtons.dataset;
    const mediaArray = mediaData && mediaData.split(',');
    if (mediaArray) this.dataArray = mediaArray;

    if (this.mediaList) {
      this.mediaList.sendApiCall(this.dataArray);
    }

    if (this.dataArray.length > 1) this.app.clearDownloadDrawer();

    this.onClosePopup();
  }

  private async onClosePopup() {
    if (!this.app) throw new Error('The app component cannot be found');
    this.dataArray = [];

    const overlay = await this.app?.overlay;

    await overlay?.dispatchAction({ type: POPUP.CLOSE });
  }
}
