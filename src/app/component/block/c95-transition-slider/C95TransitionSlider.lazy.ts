import Swiper, { EffectFade, Pagination } from 'swiper';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';

import AbstractTransitionComponent from '../../AbstractTransitionComponent';
import C95TransitionSliderTransitionController from './C95TransitionSliderTransitionController';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import { setAsInitialised } from '../../../util/setAsInitialised';
import M34ComponentBackground from 'app/component/molecule/m34-component-background/M34ComponentBackground';
import O71RegionSliderNavigation from 'app/component/organism/o71-region-slider-navigation/O71RegionSliderNavigation.lazy';
import { getComponentForElement } from 'muban-core';
import O71RegionSliderNavigationEvent from 'app/component/organism/o71-region-slider-navigation/O71RegionSliderNavigationEvent';
import O88TransitionSlide from 'app/component/organism/o88-transition-slide/O88TransitionSlide.lazy';
import M42OverlayBackground from 'app/component/molecule/m42-overlay-background/M42OverlayBackground';

import './c95-transition-slider.scss';

export default class C95TransitionSlider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c95-transition-slider';

  public readonly transitionController: C95TransitionSliderTransitionController;

  private sliderElement = this.getElement('[data-slider]');
  private pagination = this.getElement('[data-slider-pagination]');
  private titles = this.getElements('[data-pagination-title]');
  public readonly introVideo = this.getElement<HTMLVideoElement>(
    '.b-transitionSlider__intro [data-video]',
  );
  private backgrounds = this.getElements('.b-transitionSlider__backgrounds').map((container) =>
    this.getElements(`[data-component="${M34ComponentBackground.displayName}"]`, container),
  );
  private readonly backgroundVideos = this.getElements<HTMLVideoElement>(
    '.b-transitionSlider__backgrounds [data-video]',
  );
  private readonly regionSliderNavigationElements = this.getElements(
    `[data-component=${O71RegionSliderNavigation.displayName}]`,
  );
  private readonly regionSliderNavigationComponents = this.regionSliderNavigationElements.map(
    (regionSliderElement) => {
      return getComponentForElement<O71RegionSliderNavigation>(regionSliderElement);
    },
  );
  private readonly transitionSlides = this.getElements(
    `[data-component="${O88TransitionSlide.displayName}"]`,
  );
  private readonly cloudsOverlay = this.getElement(
    `[data-component="${M42OverlayBackground.displayName}"] .m-overlayBackground__overlayBackgrounds`,
  );

  private swiperSlider: Swiper | undefined = undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C95TransitionSliderTransitionController(this);
    this.initSlider();
    this.titles[0].classList.add(StateClassNames.ACTIVE);
    this.setAriaExpandedValue(this.titles[0], true);

    this.addEventListeners();
  }

  public adopted() {
    setAsInitialised(this.element);

    /**
     * Videos being paused manually because M34ComponentBackground has autoplay hardcoded to true
     * Remove these lines after it will be fixed
     */
    this.backgroundVideos.forEach((video) => {
      video.pause();
    });
  }

  private addEventListeners(): void {
    this.titles.forEach((title, index) => {
      this.addDisposableEventListener(title, 'click', () => {
        if (!this.swiperSlider) {
          throw new Error("Swiper Slider doesn't exist!");
        }

        this.titles[this.swiperSlider.activeIndex].classList.remove(StateClassNames.ACTIVE);
        this.setAriaExpandedValue(this.titles[this.swiperSlider.activeIndex], false);

        this.swiperSlider.slideTo(index);
        this.titles[index].classList.add(StateClassNames.ACTIVE);
        this.setAriaExpandedValue(this.titles[index], true);
      });
    });

    this.regionSliderNavigationComponents.forEach((component, slideIndex) => {
      this.addDisposableEventListener<O71RegionSliderNavigationEvent>(
        component.dispatcher,
        O71RegionSliderNavigationEvent.UPDATE,
        ({ regionId: backgroundIndex }) => {
          this.removeCurrentSlideBackground(slideIndex);
          this.setBackground(slideIndex, backgroundIndex);
        },
      );
    });

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );
  }

  private setAriaExpandedValue(element: HTMLElement, value: boolean) {
    const button = element.getElementsByTagName('button')[0];
    button.setAttribute('aria-expanded', `${value}`);
  }

  private initSlider() {
    if (this.sliderElement) {
      Swiper.use([Pagination, EffectFade]);

      this.swiperSlider = new Swiper(this.sliderElement, {
        effect: 'fade',
        speed: 500,
        slidesPerView: 'auto',
        on: {
          slideChange: (swiper) => {
            this.removeActiveStateFromPreviousMap(swiper.previousIndex);
            this.removeCurrentSlideBackground(swiper.previousIndex);
          },
        },
        pagination: {
          bulletClass: 'a-pageIndicators__item',
          bulletElement: 'span',
          bulletActiveClass: StateClassNames.ACTIVE,
          currentClass: StateClassNames.ACTIVE,
          el: this.pagination,
          type: 'bullets',
        },
        fadeEffect: {
          crossFade: true,
        },
      });
    }
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    if (!this.swiperSlider) {
      throw new Error("Swiper Slider doesn't exist!");
    }

    const isMobileLayout = state < mq.deviceState.LARGE;
    const maxHeight = Math.max(...this.transitionSlides.map((slide) => slide.offsetHeight));

    this.element.style.height = isMobileLayout ? 'auto' : `${maxHeight + 20}px`;

    if (isMobileLayout) {
      this.transitionSlides.forEach((element) => {
        if (element.offsetHeight < maxHeight) element.style.height = `${maxHeight}px`;
      });
    }

    this.swiperSlider.allowTouchMove = isMobileLayout;
  }

  private setBackground(slideIndex: number, backgroundIndex: number) {
    this.cloudsOverlay?.classList.toggle(StateClassNames.HIDDEN, backgroundIndex !== -1);

    if (backgroundIndex === -1) {
      return;
    }

    const background = this.backgrounds[slideIndex][backgroundIndex];
    const video = this.getElement<HTMLVideoElement>('[data-video]', background);
    background.classList.add(StateClassNames.ACTIVE);

    if (video) {
      video.currentTime = 0;
      video.play();
    }
  }

  private removeCurrentSlideBackground(slideIndex: number) {
    const stepIndex = this.regionSliderNavigationComponents[slideIndex].currentStepIndicatorIndex;

    if (stepIndex !== null) {
      const backgroundVideo = this.backgroundVideos[stepIndex];

      this.backgrounds[slideIndex][stepIndex].classList.remove(StateClassNames.ACTIVE);

      if (backgroundVideo && !backgroundVideo.paused) {
        backgroundVideo.pause();
      }
    }
  }

  private removeActiveStateFromPreviousMap(previousIndex: number) {
    const previousRegionSliderMap = this.regionSliderNavigationComponents[previousIndex];
    const stepIndex = previousRegionSliderMap.currentStepIndicatorIndex;

    previousRegionSliderMap.regionSliderMap?.classList.remove(StateClassNames.ACTIVE);

    if (stepIndex !== null) {
      previousRegionSliderMap.stepIndicators[stepIndex].classList.remove(StateClassNames.ACTIVE);
    }
  }
}
