import { StateClassNames } from 'app/data/enum/StateClassNames';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import M39StepIndicatorsTransitionController from './M39StepIndicatorsTransitionController';
import A22StepIndicator from '../../atom/a22-step-indicator/A22StepIndicator';

export default class M39StepIndicators extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm39-step-indicators';

  public readonly transitionController: M39StepIndicatorsTransitionController;

  private progressBar = this.getElement('[data-progress-bar]');
  private progressIndicator = this.getElement('[data-progress-indicator]');
  private items = this.getElements(`[data-component="${A22StepIndicator.displayName}"]`);
  private readonly direction = this.element.dir || '';

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new M39StepIndicatorsTransitionController(this);
    this.setProgressBarIndicator();
  }

  public setProgressBarIndicator(indicator?: HTMLElement): void {
    if (!this.progressIndicator || !this.progressBar) return;

    let progressIndicatorWidth = 0;

    if (indicator) {
      const { offsetLeft, offsetWidth } = indicator;
      const offsetRight = this.element.clientWidth - offsetLeft - offsetWidth;

      const offset = this.direction === 'ltr' ? offsetLeft : offsetRight;

      progressIndicatorWidth =
        ((offset + indicator.offsetWidth / 2) / this.progressBar.offsetWidth) * 100;
    }

    this.progressIndicator.style.width = `${progressIndicatorWidth}%`;
  }

  public setStepIndicator(index: number): void {
    this.items.forEach((indicator, indicatorIndex) => {
      if (index === indicatorIndex) {
        indicator.classList.add(StateClassNames.ACTIVE);
        indicator.classList.remove(StateClassNames.PASSED);
        this.setProgressBarIndicator(indicator);
      } else if (index > indicatorIndex) {
        indicator.classList.add(StateClassNames.PASSED);
        indicator.classList.remove(StateClassNames.ACTIVE);
      } else {
        indicator.classList.remove(StateClassNames.PASSED);
        indicator.classList.remove(StateClassNames.ACTIVE);
      }
    });
  }
}
