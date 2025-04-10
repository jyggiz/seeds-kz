import { TweenMax } from 'gsap';

import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O65MobileInstructionsTransitionController from './O65MobileInstructionsTransitionController';
import M02Button from '../../molecule/m02-button/M02Button';
import eases from '../../../animation/eases';
import A02Icon from '../../atom/a02-icon/A02Icon';
import O67ModalListViewer from '../o67-modal-list-viewer/O67ModalListViewer.lazy';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { getAppComponent } from 'app/util/getElementComponent';
import { O65MobileInstructionsEvent } from './O65MobileInstructionsEvent';

import './o65-mobile-instructions.scss';

export default class O65MobileInstructions extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o65-mobile-instructions';
  private readonly button = this.getElement(`[data-component="${M02Button.displayName}"`);
  public readonly icons = this.getElements(`[data-component="${A02Icon.displayName}"`);
  public itinerariesViewer: null | HTMLElement = null;
  private stopExploringButton: null | HTMLElement = null;
  public readonly transitionController: O65MobileInstructionsTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O65MobileInstructionsTransitionController(this);
  }

  private addEventListeners(): void {
    this.startLoopingAnimation();
    this.button?.addEventListener('click', () => {
      this.itinerariesViewer?.classList.add(StateClassNames.ACTIVE);
      this.stopExploringButton?.classList.add(StateClassNames.VISIBLE);
      TweenMax.to(this.element, 0.5, { autoAlpha: 0, eases: eases.VinnieInOut });

      this.element.scrollIntoView({
        block: 'center',
      });

      this.dispatcher.dispatchEvent(
        new O65MobileInstructionsEvent(O65MobileInstructionsEvent.SHOW_INSTRUCTIONS),
      );
    });
    if (this.stopExploringButton) {
      this.addDisposableEventListener(
        this.stopExploringButton,
        'click',
        this.showInstructions.bind(this),
      );
    }
  }

  private showInstructions() {
    this.stopExploringButton?.classList.remove(StateClassNames.VISIBLE);
    TweenMax.to(this.element, 0.5, { autoAlpha: 1, eases: eases.VinnieInOut });
  }

  public async adopted(): Promise<void> {
    if (!window.location.href.includes('viewMode=story')) {
      const app = await getAppComponent();
      this.itinerariesViewer = app.getElement(
        `[data-component="${O67ModalListViewer.displayName}"`,
      );
      this.stopExploringButton = app.getElement('[data-stop-exploring-button]');
    }
    this.addEventListeners();
  }
}
