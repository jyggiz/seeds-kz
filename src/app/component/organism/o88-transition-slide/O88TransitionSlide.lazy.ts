import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O88TransitionSlideTransitionController from './O88TransitionSlideTransitionController';
import App from '../../layout/app/App';
import { getAppComponent } from 'app/util/getElementComponent';
import { MODAL } from 'app/util/overlayActionTypes';
import { O91ModalStatisticProps } from '../o91-modal-statistic/O91ModalStatistic.types';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import deviceStateTracker from 'app/util/deviceStateTracker';

import './o88-transition-slide.scss';

const lazyO91Template = () =>
  import(
    '../o91-modal-statistic/o91-modal-statistic.hbs?include'
  ) as LoadTemplateImport<O91ModalStatisticProps>;
export default class O88TransitionSlide extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o88-transition-slide';

  public readonly transitionController: O88TransitionSlideTransitionController;
  private data = this.element.dataset.statistic && JSON.parse(this.element.dataset.statistic);
  private readMoreButton = this.getElement('[data-open-modal-button');
  private app: App | null = null;
  private readonly hotspotLinks = this.getElements('a.a-stepIndicator');
  private isMobile = deviceStateTracker.currentDeviceState.state < 3;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new O88TransitionSlideTransitionController(this);

    this.readMoreButton?.addEventListener('click', this.openModal.bind(this));

    this.hotspotLinks.forEach((hotspot) => {
      this.addDisposableEventListener(hotspot, 'click', (event) => {
        if (this.isMobile) {
          event.preventDefault();
        }
      });
    });
  }

  private async openModal() {
    const template = await lazyO91Template();

    const overlay = await this.app?.overlay;

    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: template.default,
        data: { content: this.data },
        options: {
          classnames: [StateClassNames.TRANSPARENT_PANEL],
        },
      },
    });
  }

  public async adopted() {
    this.app = await getAppComponent();
  }
}
