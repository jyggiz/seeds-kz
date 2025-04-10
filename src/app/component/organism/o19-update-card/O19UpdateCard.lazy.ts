import AbstractComponent from 'app/component/AbstractComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import M02Button from '../../molecule/m02-button/M02Button';
import { getDisplayNameWithoutId } from '../../../util/getDisplayNameWithoutId';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';
import { isAnchorTag } from '../../../util/isAnchorTag';

import './o19-update-card.scss';

export default class O19UpdateCard extends AbstractComponent {
  public static readonly displayName: string = 'o19-update-card';

  private readonly button = this.getElement(`[data-component="${M02Button.displayName}"]`);
  private readonly cardDescription = this.getElement('[data-card-title]');

  constructor(el: HTMLElement) {
    super(el);

    this.addDisposableEventListener(this.element, 'mouseenter', this.onMouseEnter.bind(this));
    this.addDisposableEventListener(this.element, 'mouseleave', this.onMouseLeave.bind(this));
    this.addDisposableEventListener(this.element, 'click', this.trackItemClick.bind(this));
  }

  private trackItemClick(): void {
    const linkElement = this.element.querySelector('a');

    trackEvent({
      event: TrackingEventNames.SELECT_CONTENT,
      aem_component_id: O19UpdateCard.displayName,
      aem_component_name: getDisplayNameWithoutId(O19UpdateCard.displayName),
      link_domain: window.location.hostname,
      link_url: isAnchorTag(linkElement) ? linkElement.href : '',
      click_text: this.cardDescription?.textContent || '',
    });
  }

  private onMouseEnter(): void {
    this.button?.classList.add(StateClassNames.HOVER);
  }

  private onMouseLeave(): void {
    this.button?.classList.remove(StateClassNames.HOVER);
  }
}
