import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O14PopoutCardTransitionController from './O14PopoutCardTransitionController';
import M02Button from '../../molecule/m02-button/M02Button';
import { getAppComponent } from '../../../util/getElementComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getDisplayNameWithoutId } from '../../../util/getDisplayNameWithoutId';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';
import { isAnchorTag } from '../../../util/isAnchorTag';
import App from '../../layout/app/App';

import './o14-popout-card.scss';

export default class O14PopoutCard extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o14-popout-card';

  public readonly transitionController: O14PopoutCardTransitionController;

  private app: App | null = null;
  private readonly button = this.getElement(`[data-component="${M02Button.displayName}"]`);
  private readonly cardTitle = this.getElement<HTMLElement>('[data-card-title]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O14PopoutCardTransitionController(this);
  }

  public async adopted() {
    this.app = await getAppComponent();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(this.element, 'mouseenter', this.onMouseEnter.bind(this));
    this.addDisposableEventListener(this.element, 'mouseleave', this.onMouseLeave.bind(this));
    this.addDisposableEventListener(this.element, 'click', this.trackItemClick.bind(this));
  }

  private onMouseEnter(): void {
    this.button?.classList.add(StateClassNames.HOVER);
  }

  private onMouseLeave(): void {
    this.button?.classList.remove(StateClassNames.HOVER);
  }

  private trackItemClick(): void {
    const linkElement = this.element.querySelector('a');

    trackEvent({
      event: TrackingEventNames.SELECT_CONTENT,
      aem_component_id: this.displayName,
      aem_component_name: getDisplayNameWithoutId(this.displayName),
      link_domain: window.location.hostname,
      link_url: isAnchorTag(linkElement) ? linkElement.href : '',
      click_text: this.cardTitle?.textContent || '',
    });
  }

  public dispose() {
    super.dispose();
  }
}
