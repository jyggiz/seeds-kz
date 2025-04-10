import AbstractComponent from 'app/component/AbstractComponent';
import trackEvent, { TrackingEventActions, TrackingEventNames } from 'app/util/TrackingEvent';
import addRippleEffect from '../../../animation/addRippleEffect';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { VIDEO } from 'app/util/overlayActionTypes';
import { O01VideoProps } from 'app/component/organism/o01-video/O01Video.types';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { isAnchorTag } from '../../../util/isAnchorTag';
import { M02ButtonLevel } from './M02Button.types';

const lazyO01Template = () =>
  import('../../organism/o01-video/o01-video.hbs?include') as LoadTemplateImport<O01VideoProps>;

export default class M02Button extends AbstractComponent {
  public static readonly displayName: string = 'm02-button';
  public allowVideoModal: boolean = true;

  private eventTracking = this.element.dataset.eventTracking;
  private readonly buttonContainer: HTMLElement | null = this.getElement('[data-button-container]');
  private readonly videoData: O01VideoProps =
    this.element.dataset.video && JSON.parse(<string>this.element.dataset.video);

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted() {
    const enableRippleEffect =
      !this.element.classList.contains(`-tertiary`) &&
      !this.element.classList.contains(`-navigation`);
    enableRippleEffect &&
      this.disposables.add(addRippleEffect(<HTMLDivElement>this.buttonContainer));
    this.onCTAClick();

    this.app = await getAppComponent();
    this.addEventListeners();
    this.updateAriaDisabled();
  }

  private addEventListeners(): void {
    if (this.videoData) {
      this.addDisposableEventListener(this.element, 'click', () => {
        this.onPlayClick();
      });
    }
  }

  private async onPlayClick(): Promise<void> {
    if (this.videoData && this.allowVideoModal) {
      const data = this.videoData;
      const [o01Template, overlay] = await Promise.all([lazyO01Template(), this.app?.overlay]);

      this.videoData &&
        (await overlay?.dispatchAction({
          type: VIDEO.STANDARD_DYNAMIC,
          payload: {
            template: o01Template.default,
            data,
          },
        }));
    }
  }

  public set level(value: M02ButtonLevel) {
    this.element.classList.remove('-primary', '-secondary', '-tertiary');
    this.element.classList.add(`-${value}`);
  }

  public updateAriaDisabled(value = false): void {
    this.element.removeAttribute('disabled');
    this.element.setAttribute(
      'aria-disabled',
      `${this.element.classList.contains(StateClassNames.DISABLED) || value}`,
    );
  }

  private onCTAClick() {
    this.addDisposableEventListener(this.element, 'click', () => {
      this.eventTracking && this.trackCTA();
    });
  }

  private trackCTA(): void {
    const buttonLabel = this.element.querySelector('.a-label') as HTMLElement;
    const isAnchorElement = isAnchorTag(this.element);
    const linkElement = this.element as HTMLAnchorElement;

    if (this.eventTracking) {
      const eventTrackingObject = JSON.parse(this.eventTracking);
      trackEvent({
        event: TrackingEventNames.CLICK,
        aem_component_id: eventTrackingObject.componentId || '',
        aem_component_name: this.element.dataset.componentName || '',
        eventAction: TrackingEventActions.CTA_CLICK,
        linkDomain: isAnchorElement ? linkElement.hostname : '',
        linkUrl: isAnchorElement ? linkElement.href : '',
        clickText: buttonLabel.innerText,
      });
    }
  }
}
