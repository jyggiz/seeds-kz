import AbstractComponent from 'app/component/AbstractComponent';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

export default class M21SectorMenuItem extends AbstractComponent {
  public static readonly displayName: string = 'm21-sector-menu-item';

  constructor(el: HTMLAnchorElement) {
    super(el);

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(this.element, 'click', () => {
      const anchorElement = this.element as HTMLAnchorElement;

      trackEvent({
        event: TrackingEventNames.NAVIGATION_CLICK,
        navigation_type: 'header',
        link_domain: anchorElement.hostname,
        link_url: anchorElement.href,
        click_text: anchorElement.innerText || '',
      });
    });
  }
}
