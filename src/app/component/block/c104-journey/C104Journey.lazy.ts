import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O95DynamicCarousel from 'app/component/organism/o95-dynamic-carousel/O95DynamicCarousel';
import { getComponentForElement } from 'muban-core';
import Swiper, { EffectCoverflow, SwiperOptions } from 'swiper';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { IDeviceState } from 'seng-device-state-tracker/lib/IDeviceStateConfig';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { isEditor } from '../../../util/aemEditorUtils';

import './c104-journey.scss';

export default class C104Journey extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c104-journey';
  private readonly carouselElement = this.getElement(
    `[data-component="${O95DynamicCarousel.displayName}"]`,
  );
  private readonly dynamicCarousel =
    this.carouselElement && getComponentForElement<O95DynamicCarousel>(this.carouselElement);
  private readonly timeline = this.getElement('[data-timeline]');
  private readonly cardsInfo = this.getElements('[data-card-info]');
  private readonly slides = this.getElements(
    `[data-component="${O95DynamicCarousel.displayName}"] [data-dynamic-slide]`,
  );
  private readonly timelinePointElements =
    this.timeline && this.getElements('[data-timeline-point-id]', this.timeline);
  private readonly initialSlideIndex = Number(this.element.dataset.initialSlideIndex);
  private previousTimelinePointId: string = '';
  private previousSlideIndex = this.initialSlideIndex;
  private swiperInstance: Swiper | null = null;
  private isLargeViewport: boolean | null = null;
  private SLIDE_TRANSITION_SPEED: number = 800;
  private readonly enableLooping: boolean = !isEditor();

  constructor(el: HTMLElement) {
    super(el);

    this.initSlider(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      ({ data }) => this.initSlider(data),
    );

    if (this.timelinePointElements) {
      this.timelinePointElements.forEach((timelinePoint) => {
        const descriptionElement = this.getElement(
          '[data-timeline-point-description]',
          timelinePoint,
        );
        const id = timelinePoint.dataset.timelinePointId;

        if (descriptionElement && id) {
          this.addDisposableEventListener(descriptionElement, 'click', () =>
            this.navigateToSlide(id),
          );
        }
      });
    }
  }

  private navigateToSlide(id: string): void {
    const firstSlideIndexWithId = this.slides.findIndex((slide) =>
      this.getElement(`[data-timeline-point-id="${id}"]`, slide),
    );

    if (this.enableLooping) {
      this.swiperInstance?.slideToLoop(firstSlideIndexWithId);
      return;
    }

    this.swiperInstance?.slideTo(firstSlideIndexWithId);
  }

  private initSlider(deviceState: IDeviceState) {
    const wasLargeViewport = this.isLargeViewport;
    const isLargeViewport = deviceState.state < mq.deviceState.MEDIUM;

    if (isLargeViewport !== wasLargeViewport) {
      if (this.swiperInstance) {
        this.swiperInstance.destroy();
      }
      if (isLargeViewport) {
        this.initMobileSlider();
      } else {
        this.initDesktopSlider();
      }
    }

    this.isLargeViewport = isLargeViewport;
  }

  private initMobileSlider() {
    const extraSwiperOptions: SwiperOptions = {
      grabCursor: true,
      slidesPerView: 1.2,
      loop: this.enableLooping,
      initialSlide: this.initialSlideIndex,
      loopedSlides: this.slides.length,
      spaceBetween: 30,
      speed: this.SLIDE_TRANSITION_SPEED,
      on: {
        slideChange: this.onSwiperSlideChange.bind(this),
      },
    };
    if (this.dynamicCarousel) {
      this.swiperInstance = this.dynamicCarousel.initSlider(extraSwiperOptions);
    }
  }

  private initDesktopSlider() {
    const extraSwiperOptions: SwiperOptions = {
      effect: 'coverflow' as const,
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto' as const,
      loop: this.enableLooping,
      loopedSlides: this.slides.length,
      initialSlide: this.initialSlideIndex,
      speed: this.SLIDE_TRANSITION_SPEED,
      coverflowEffect: {
        rotate: 0,
        stretch: 100,
        depth: 100,
        modifier: 3,
        slideShadows: true,
      },
      on: {
        slideChange: this.onSwiperSlideChange.bind(this),
      },
      breakpoints: {
        1478: {
          coverflowEffect: {
            stretch: 50,
          },
        },
        1680: {
          coverflowEffect: {
            stretch: 20,
          },
        },
      },
    };
    if (this.dynamicCarousel) {
      this.swiperInstance = this.dynamicCarousel.initSlider(extraSwiperOptions, [EffectCoverflow]);
    }
  }

  private onSwiperSlideChange(swiperInstance: Swiper) {
    const realIndex = swiperInstance.realIndex;
    this.highlightActiveCardInfo(realIndex);
    this.highlightActiveTimelinePoint(realIndex);
    this.savePreviousSwiperIndex(realIndex);
  }

  private savePreviousSwiperIndex(activeSlideIndex: number) {
    this.previousSlideIndex = activeSlideIndex;
  }

  private highlightActiveCardInfo(activeSlideIndex: number) {
    const activeCardInfo = this.cardsInfo[activeSlideIndex];
    const previousCardInfo = this.cardsInfo[this.previousSlideIndex];

    if (activeCardInfo) {
      activeCardInfo.classList.add(StateClassNames.ACTIVE);
    }
    if (activeSlideIndex !== this.previousSlideIndex && previousCardInfo) {
      previousCardInfo.classList.remove(StateClassNames.ACTIVE);
    }
  }

  private highlightActiveTimelinePoint(activeSlideIndex: number) {
    const activeCardTimelinePointId = this.getTimelinePointIdFromCard(activeSlideIndex);

    if (activeCardTimelinePointId && activeCardTimelinePointId !== this.previousTimelinePointId) {
      if (this.timeline) {
        const currentTimelinePoint = this.getElement(
          `[data-timeline-point-id="${activeCardTimelinePointId}"`,
          this.timeline,
        );
        const previousTimelinePoint = this.getElement(
          `[data-timeline-point-id="${this.previousTimelinePointId}"`,
          this.timeline,
        );

        currentTimelinePoint?.classList.add(StateClassNames.ACTIVE);
        previousTimelinePoint?.classList.remove(StateClassNames.ACTIVE);
        this.previousTimelinePointId = activeCardTimelinePointId;
      }
    }
  }

  private getTimelinePointIdFromCard(activeSlideIndex: number) {
    const activeSlide = this.slides[activeSlideIndex];
    const activeJourneyCard = this.getElement('[data-timeline-point-id]', activeSlide);

    return activeJourneyCard?.dataset.timelinePointId;
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
