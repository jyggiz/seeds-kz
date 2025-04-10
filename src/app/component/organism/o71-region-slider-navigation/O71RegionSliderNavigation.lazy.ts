import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O71RegionSliderNavigationTransitionController from './O71RegionSliderNavigationTransitionController';
import A22StepIndicator from '../../atom/a22-step-indicator/A22StepIndicator';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { updateClassForItems } from '../../../util/stateClassNamesToggle';
import O71RegionSliderNavigationEvent from './O71RegionSliderNavigationEvent';

import './o71-region-slider-navigation.scss';

export default class O71RegionSliderNavigation extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o71-region-slider-navigation';
  private regionSliders = this.getElements(`[data-region-slider-region]`);
  private readonly isTouchDevice: boolean | null;
  private resetOnLeave = Boolean(this.element.dataset.resetOnLeave || '');

  public regionSliderMap = this.getElement('[data-region-slider-map]');
  public currentStepIndicatorIndex: number | null = null;
  public stepIndicators = this.getElements(`[data-component="${A22StepIndicator.displayName}"]`);

  private resetActiveStateTimeoutId: number | null = null;

  public readonly transitionController: O71RegionSliderNavigationTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O71RegionSliderNavigationTransitionController(this);

    this.isTouchDevice = this.getTouchDevice();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.stepIndicators.forEach((stepIndicator, index) => {
      if (this.isTouchDevice) {
        this.addDisposableEventListener(stepIndicator, 'click', () => {
          this.changeRegion(stepIndicator, index);
        });
      } else {
        ['focus', 'mouseenter'].forEach((event) => {
          this.addDisposableEventListener(stepIndicator, event, () => {
            this.onMouseEnter(stepIndicator, index);
          });
        });

        if (this.resetOnLeave) {
          ['blur', 'mouseleave'].forEach((event) => {
            this.addDisposableEventListener(stepIndicator, event, () => {
              this.onMouseLeave(stepIndicator, -1, this.resetOnLeave);
            });
          });
        }
      }
    });
  }

  private onMouseEnter(stepIndicator: HTMLElement, index: number): void {
    if (this.resetActiveStateTimeoutId) {
      clearTimeout(this.resetActiveStateTimeoutId);
      this.resetActiveStateTimeoutId = null;
    }

    this.changeRegion(stepIndicator, index);
  }

  private onMouseLeave(stepIndicator: HTMLElement, index: number, reset?: boolean): void {
    this.resetActiveStateTimeoutId = setTimeout(
      () => this.changeRegion(stepIndicator, index, reset),
      250,
    );
  }

  private changeRegion(stepIndicator: HTMLElement, index: number, reset?: boolean) {
    if (!stepIndicator.classList.contains(StateClassNames.ACTIVE) || reset) {
      updateClassForItems({
        removeFrom: this.stepIndicators,
        addToOne: this.stepIndicators[index],
        className: StateClassNames.ACTIVE,
      });

      updateClassForItems({
        removeFrom: this.regionSliders,
        addToOne: this.regionSliders[index],
        className: StateClassNames.ACTIVE,
      });

      this.regionSliderMap?.classList.toggle(StateClassNames.ACTIVE, !reset);

      this.dispatcher.dispatchEvent(
        new O71RegionSliderNavigationEvent(O71RegionSliderNavigationEvent.UPDATE, index),
      );

      this.currentStepIndicatorIndex = index !== -1 ? index : null;
    }
  }

  private getTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}
