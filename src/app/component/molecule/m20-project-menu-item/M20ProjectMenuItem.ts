import AbstractComponent from 'app/component/AbstractComponent';
import deviceStateTracker from 'app/util/deviceStateTracker';
import { TweenMax } from 'gsap';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

export default class M20ProjectMenuItem extends AbstractComponent {
  public static readonly displayName: string = 'm20-project-menu-item';
  private link = this.getElement<HTMLAnchorElement>('[data-link]');
  private isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.XXLARGE;

  constructor(el: HTMLElement) {
    super(el);

    this.addEventListeners();
  }

  private addEventListeners() {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.addHoverEventListeners();

    if (this.link) {
      const { hostname, href, innerText = '' } = this.link;

      this.addDisposableEventListener(this.link, 'click', () => {
        trackEvent({
          event: TrackingEventNames.NAVIGATION_CLICK,
          navigation_type: 'header',
          link_domain: hostname,
          link_url: href,
          click_text: innerText,
        });
      });
    }
  }

  private addHoverEventListeners() {
    const description = this.link?.querySelector('.m-projectMenuItem__copy');
    if (!description) return;

    ['mouseenter', 'mouseleave', 'focus', 'blur'].forEach((event) => {
      if (!this.link) return;
      this.addDisposableEventListener(this.link, event, () => {
        if (this.isMobile) return;

        const isHover = ['mouseenter', 'focus'].includes(event);

        TweenMax.to(description, 0.3, {
          height: isHover ? description.scrollHeight : 0,
          autoAlpha: isHover ? 1 : 0,
        });
      });
    });
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.XXLARGE;
  }
}
