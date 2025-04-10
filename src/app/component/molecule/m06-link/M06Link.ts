import AbstractComponent from 'app/component/AbstractComponent';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

export default class M06Link extends AbstractComponent {
  public static readonly displayName: string = 'm06-link';

  constructor(el: HTMLAnchorElement) {
    super(el);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(this.element, 'click', () => {
      const anchorElement = this.element as HTMLAnchorElement;

      trackEvent({
        event: TrackingEventNames.LINK_CLICK,
        aem_component_id: this.element.dataset.component || '',
        aem_component_name: this.element.dataset.componentName || '',
        linkDomain: anchorElement.hostname,
        linkUrl: anchorElement.href,
      });
    });
  }
}
