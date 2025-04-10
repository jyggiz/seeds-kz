import AbstractComponent from 'app/component/AbstractComponent';
import { getDisplayNameWithoutId } from '../../../util/getDisplayNameWithoutId';
import TrackingEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

export default class M12Social extends AbstractComponent {
  public static readonly displayName: string = 'm12-social';

  private readonly links = this.getElements<HTMLAnchorElement>('[data-social-link]');

  public adopted() {
    this.links.forEach((link) =>
      this.addDisposableEventListener(link, 'click', () => {
        if (link.dataset.label)
          TrackingEvent({
            event: TrackingEventNames.SOCIAL_FAVICON,
            aem_component_id: M12Social.displayName,
            aem_component_name: getDisplayNameWithoutId(M12Social.displayName),
            social_network: link.dataset.label,
          });
      }),
    );
  }
}
