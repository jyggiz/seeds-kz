import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C05RegionSliderTransitionController from './C05RegionSliderTransitionController';
import O71RegionSliderNavigation from '../../organism/o71-region-slider-navigation/O71RegionSliderNavigation.lazy';
import O71RegionSliderNavigationEvent from '../../organism/o71-region-slider-navigation/O71RegionSliderNavigationEvent';
import { getComponentForElement } from 'muban-core';
import O72RegionSliderContent from '../../organism/o72-region-slider-content/O72RegionSliderContent.lazy';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import A22StepIndicator from '../../atom/a22-step-indicator/A22StepIndicator';
import { Linear, TweenMax } from 'gsap';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c05-region-slider.scss';

export default class C05RegionSlider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c05-region-slider';

  public readonly transitionController: C05RegionSliderTransitionController;

  private readonly regionSliderNavigationElement = this.getElement(
    `[data-component=${O71RegionSliderNavigation.displayName}]`,
  );

  private readonly regionSliderRegions = this.getElements(`[data-region-slider-region]`);

  private readonly activeItem = this.element.getAttribute('data-active-item');

  private readonly regionSliderNavigationComponent =
    this.regionSliderNavigationElement &&
    getComponentForElement<O71RegionSliderNavigation>(this.regionSliderNavigationElement);

  private readonly regionSliderContentElement = this.getElement(
    `[data-component=${O72RegionSliderContent.displayName}]`,
  );

  private readonly stepIndicatorSteps = this.getElements(
    `[data-component=${A22StepIndicator.displayName}]`,
  );

  private readonly regionIntro = this.getElement('[data-region-intro]');
  private readonly regionIntroBackground = this.getElement('[data-region-intro-background]');

  private readonly regionSliderContentComponent =
    this.regionSliderContentElement &&
    getComponentForElement<O72RegionSliderContent>(this.regionSliderContentElement);

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C05RegionSliderTransitionController(this);
  }

  public adopted(): void {
    setAsInitialised(this.element);

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.setActiveItem();

    if (this.regionSliderNavigationComponent)
      this.addDisposableEventListener<O71RegionSliderNavigationEvent>(
        this.regionSliderNavigationComponent.dispatcher,
        O71RegionSliderNavigationEvent.UPDATE,
        ({ regionId }) => this.changeRegion(regionId),
      );

    if (this.regionIntro) {
      this.stepIndicatorSteps.forEach((step) => {
        this.addDisposableEventListener(step, 'mouseenter', () => {
          this.hideIntro(step);
        });
        this.addDisposableEventListener(step, 'click', () => {
          this.hideIntro(step);
        });
      });
    }
  }

  private hideIntro(step: HTMLElement) {
    if (
      step.classList.contains(StateClassNames.ACTIVE) &&
      this.regionIntro &&
      this.regionIntroBackground
    ) {
      TweenMax.set(this.regionIntro, {
        autoAlpha: 0,
        ease: Linear.easeNone,
      });
      TweenMax.to(this.regionIntroBackground, 0.5, {
        autoAlpha: 0,
        ease: Linear.easeNone,
      });
    }
  }

  private setActiveItem() {
    if (this.activeItem && !this.regionIntro) {
      const activeItemIndex = parseInt(this.activeItem) - 1;
      this.regionSliderRegions[activeItemIndex].classList.add(StateClassNames.ACTIVE);
    }
  }

  private async changeRegion(regionId: number): Promise<void> {
    if (!this.regionSliderContentComponent)
      throw new Error('O72RegionSliderContent does not exist');

    await this.regionSliderContentComponent.showRegion(regionId);
  }
}
