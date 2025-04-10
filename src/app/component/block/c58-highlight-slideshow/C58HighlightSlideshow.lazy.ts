import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import A01Image from 'app/component/atom/a01-image/A01Image';
import C58HighlightSlideshowTransitionController from './C58HighlightSlideshowTransitionController';
import { TweenMax } from 'gsap';
import M48SliderPagination from '../../molecule/m48-slider-pagination/M48SliderPagination';
import { setAsInitialised } from 'app/util/setAsInitialised';
import TrackingEvent, {
  TrackingEventActions,
  TrackingEventCategories,
  TrackingEventNames,
} from '../../../util/TrackingEvent';
import isEmpty from 'lodash-es/isEmpty';
import { StateClassNames } from 'app/data/enum/StateClassNames';

enum SlideDirection {
  NEXT = 'next',
  PREVIOUS = 'previous',
}

import './c58-highlight-slideshow.scss';

export default class C58HighlightSlideshow extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c58-highlight-slideshow';

  public readonly transitionController: C58HighlightSlideshowTransitionController;

  private readonly slidesContainer = this.getElement('[data-slideshow-container]');
  private readonly slides = this.getElements('[data-slide]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  public readonly sliderPagination = this.getComponent<M48SliderPagination>(
    M48SliderPagination.displayName,
  );
  public readonly sliderControls = this.getElement('[data-controls]');

  private sliderPaginationItems = this.getElements('[data-pagination-bar]');
  private isRoundedPagination = this.getElement(
    '.b-highlightSlideshow__pagination',
  )?.classList.contains('-rounded');
  private touchStartX = 0;
  private touchEndX = 0;
  private touchStartY = 0;
  private touchEndY = 0;
  private slideChangeDuration: number = 6;
  private _activeSlideIndex: number = 0;
  private previousSlideIndex: number = 0;
  private advanceInterval: number | null = null;
  private disabledScaleAnimation = this.element.hasAttribute('data-disabled-scale-animation');

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new C58HighlightSlideshowTransitionController(this);

    if (this.sliderPagination) this.sliderPagination.slideDuration = this.slideChangeDuration;

    if (this.sliderControls) this.addEventListeners();

    const initial = this.slides.findIndex((slide) =>
      slide.classList.contains(StateClassNames.ACTIVE),
    );
    this.activeSlideIndex = initial === -1 ? 0 : initial;
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.hideSlides();
  }

  private hideSlides(): void {
    TweenMax.set(this.slides, {
      autoAlpha: 0,
    });
  }

  public startAutoPlay(): void {
    this.autoAdvance();
    this.showInitialActiveSlide();
  }

  private showInitialActiveSlide(): void {
    this.changeSlideTransition(this.slides[this.activeSlideIndex]);
    this.sliderPagination?.toggleSlide(this.activeSlideIndex);
    this.trackSliderImpression(this.activeSlideIndex);
  }

  public get activeSlideIndex(): number {
    return this._activeSlideIndex;
  }

  public set activeSlideIndex(value: number) {
    this._activeSlideIndex = value;

    if (this.sliderPagination) {
      this.sliderPagination.activeSlideIndex = value;

      if (this.isRoundedPagination) {
        this.sliderPaginationItems[this.previousSlideIndex].classList.remove(
          StateClassNames.ACTIVE,
        );
        this.sliderPaginationItems[value].classList.add(StateClassNames.ACTIVE);
      }
    }
  }

  private addEventListeners(): void {
    if (this.previousButton)
      this.addButtonEventListener(this.previousButton, SlideDirection.PREVIOUS);

    if (this.nextButton) this.addButtonEventListener(this.nextButton, SlideDirection.NEXT);

    if (this.slidesContainer) {
      this.addDisposableEventListener(this.slidesContainer, 'touchstart', (event: TouchEvent) => {
        this.touchStartX = event.changedTouches[0].screenX;
        this.touchStartY = event.changedTouches[0].screenY;
      });

      this.addDisposableEventListener(this.slidesContainer, 'touchend', (event: TouchEvent) => {
        this.touchEndX = event.changedTouches[0].screenX;
        this.touchEndY = event.changedTouches[0].screenY;
        this.trackSliderInteraction();
        this.onSwipe();
      });
    }
  }

  private addButtonEventListener(element: HTMLElement, direction: SlideDirection): void {
    this.addDisposableEventListener(element, 'click', () => {
      this.trackSliderInteraction();
      this.changeSlide(direction);
      this.restartRepeater();
    });
  }

  private onSwipe(): void {
    const xDelta = Math.abs(this.touchStartX - this.touchEndX);
    const yDelta = Math.abs(this.touchStartY - this.touchEndY);

    if (yDelta > xDelta) return;

    const direction =
      this.touchEndX <= this.touchStartX ? SlideDirection.NEXT : SlideDirection.PREVIOUS;
    this.changeSlide(direction);
    this.restartRepeater();
  }

  private changeSlide(direction: SlideDirection.NEXT | SlideDirection.PREVIOUS): void {
    const lastSlideIndex = this.slides.length - 1;

    if (direction === SlideDirection.NEXT) {
      this.activeSlideIndex =
        this.activeSlideIndex === lastSlideIndex ? 0 : this.activeSlideIndex + 1;
    } else if (direction === SlideDirection.PREVIOUS) {
      this.activeSlideIndex =
        this.activeSlideIndex === 0 ? lastSlideIndex : this.activeSlideIndex - 1;
    }

    if (this.previousSlideIndex !== null) {
      this.changeSlideTransition(this.slides[this.previousSlideIndex], false, 0);
    }

    this.sliderPagination?.showPassedPaginationBars();

    this.changeSlideTransition(this.slides[this.activeSlideIndex]);

    this.previousSlideIndex = this.activeSlideIndex;
    this.sliderPagination?.toggleSlide(this.activeSlideIndex);
    this.trackSliderImpression(this.activeSlideIndex);
  }

  private changeSlideTransition(
    slideIndex: HTMLElement,
    isShown = true,
    scaleDuration = this.slideChangeDuration,
  ): void {
    const image = this.getElement(
      `[data-component="${A01Image.displayName}"]`,
      slideIndex,
    ) as HTMLElement;

    if (image) {
      this.transitionController.toggleSlide({
        slide: slideIndex,
        image,
        isShown,
        autoAlphaDuration: 0.5,
        scaleDuration,
        disabledScaleAnimation: this.disabledScaleAnimation,
      });
    }
  }

  private autoAdvance(): void {
    this.advanceInterval = setInterval(() => {
      this.changeSlide(SlideDirection.NEXT);
    }, this.slideChangeDuration * 1000);
  }

  private restartRepeater(): void {
    if (this.advanceInterval) {
      clearInterval(this.advanceInterval);
    }
    this.autoAdvance();
  }

  private trackSliderInteraction(): void {
    TrackingEvent({
      event: TrackingEventNames.SLIDER_INTERACTION,
      sliderAction: TrackingEventActions.SLIDER_CLICK,
      sliderCategory: TrackingEventCategories.SLIDER_INTERACTION,
      componentId: this.element.id,
      componentName: C58HighlightSlideshow.displayName,
    });
  }

  private trackSliderImpression(slideIndex: number): void {
    const eventTrackingData = JSON.parse(this.slides[slideIndex].dataset['eventTracking'] || '{}');

    !isEmpty(eventTrackingData) &&
      TrackingEvent({
        event: TrackingEventNames.SLIDER_IMPRESSION,
        slider: {
          slideTitleInEnglish: eventTrackingData.slider.slideTitleInEnglish,
          slideOrder: slideIndex,
        },
        componentId: this.element.id,
        componentName: C58HighlightSlideshow.displayName,
      });
  }

  public dispose() {
    this.advanceInterval && clearInterval(this.advanceInterval);
    super.dispose();
  }
}
