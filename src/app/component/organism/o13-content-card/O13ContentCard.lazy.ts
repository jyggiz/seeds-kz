import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O13ContentCardTransitionController from './O13ContentCardTransitionController';
import { VIDEO } from '../../../util/overlayActionTypes';
import App from '../../layout/app/App';
import { O01VideoProps } from '../o01-video/O01Video.types';
import { getAppComponent } from '../../../util/getElementComponent';
import M02Button from '../../molecule/m02-button/M02Button';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getDisplayNameWithoutId } from '../../../util/getDisplayNameWithoutId';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';
import { isAnchorTag } from '../../../util/isAnchorTag';

import './o13-content-card.scss';

const lazyO01Template = () =>
  import('../../organism/o01-video/o01-video.hbs?include') as LoadTemplateImport<O01VideoProps>;

export default class O13ContentCard extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o13-content-card';

  public readonly transitionController: O13ContentCardTransitionController;

  private readonly videoData: O01VideoProps =
    this.element.dataset.video && JSON.parse(<string>this.element.dataset.video);

  private readonly button = this.getElement(`[data-component="${M02Button.displayName}"]`);
  private readonly cardTitle = this.getElement<HTMLElement>('[data-card-title]');

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O13ContentCardTransitionController(this);
  }

  public async adopted() {
    this.app = await getAppComponent();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(this.element, 'mouseenter', this.onMouseEnter.bind(this));
    this.addDisposableEventListener(this.element, 'mouseleave', this.onMouseLeave.bind(this));
    this.addDisposableEventListener(this.element, 'click', () => {
      this.onCardClick();
      this.trackItemClick();
    });
  }

  private onMouseEnter(): void {
    this.button?.classList.add(StateClassNames.HOVER);
  }

  private onMouseLeave(): void {
    this.button?.classList.remove(StateClassNames.HOVER);
  }

  private async onCardClick(): Promise<void> {
    if (this.videoData) {
      const [o01Template, overlay] = await Promise.all([lazyO01Template(), this.app?.overlay]);

      this.videoData &&
        (await overlay?.dispatchAction({
          type: VIDEO.STANDARD_DYNAMIC,
          payload: {
            template: o01Template.default,
            data: this.videoData,
          },
        }));
    }
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
