import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O49PopupExpertContentTransitionController from './O49PopupExpertContentTransitionController';
import { getAppComponent } from '../../../util/getElementComponent';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import App from '../../layout/app/App';
import { POPUP } from 'app/util/overlayActionTypes';

export default class O49PopupExpertContent extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o49-popup-expert-content';

  public readonly transitionController: O49PopupExpertContentTransitionController;

  private closeButton = this.getElement('[data-close-button]');
  private expertPopup = this.getElement('[data-expert-popup]');
  private expertPopupMask = this.getElement('[data-expert-mask]');

  private isPopupClosed: boolean = false;
  private isMobile: boolean = false;
  private app: App | null = null;
  public cardInformation: any = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O49PopupExpertContentTransitionController(this);

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.closeButton &&
      this.addDisposableEventListener(this.closeButton, 'click', this.dispatchCloseAction);
    this.expertPopupMask &&
      this.addDisposableEventListener(this.expertPopupMask, 'click', this.dispatchCloseAction);

    this.expertPopup &&
      this.addDisposableEventListener(this.expertPopup, 'mouseover', () => {
        this.onMouseEnter();
      });

    this.expertPopup &&
      this.addDisposableEventListener(this.expertPopup, 'mouseleave', () => {
        if (this.isPopupClosed) return;
        this.onMouseLeave();
      });
  }

  private dispatchCloseAction = async () => {
    const overlay = await this.app?.overlay;

    await overlay?.dispatchAction({ type: POPUP.CLOSE });
  };
  public async adopted() {
    this.app = await getAppComponent();

    this.isPopupClosed = false;
    const cardInformation =
      this.element.dataset.cardInformation && JSON.parse(this.element.dataset.cardInformation);

    if (cardInformation) {
      this.cardInformation.x = cardInformation.x;
      this.cardInformation.y = cardInformation.y;
      this.cardInformation.width = cardInformation.width;
      this.cardInformation.height = cardInformation.height;
    }

    this.transitionController.animateIn(this.cardInformation, this.isMobile);

    this.addDisposableEventListener(this.app?.element, 'overlayAction', (event) => {
      if ((event as unknown as CustomEvent).detail.type === POPUP.CLOSE) {
        this.closePopup();
        this.transitionOut();
      }
    });
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    state > mq.deviceState.LARGE ? (this.isMobile = false) : (this.isMobile = true);
  }

  public closePopup() {
    if (this.app === null) throw new Error('App was not found');

    this.isPopupClosed = true;

    this.transitionController.animateOut(this.cardInformation, this.isMobile);
  }

  private onMouseEnter() {
    if (this.app === null) throw new Error('App was not found');

    this.app.transformCursor(false);
  }

  private onMouseLeave() {
    if (this.app === null) throw new Error('App was not found');

    this.app.transformCursor(true, 'cross');
  }
}
