import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { TimelineMax } from 'gsap';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { getComponentForElement } from 'muban-core';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import Swiper, { Navigation, Pagination } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import mq from '../../../data/shared-variable/media-queries.json';
import { getAppComponent } from '../../../util/getElementComponent';
import { toggleControlsVisibility } from '../../../util/swiper/toggleControlsVisibility';
import App from '../../layout/app/App';
import C12HeroSliderTransitionController from './C12HeroSliderTransitionController';
import deviceStateTracker from 'app/util/deviceStateTracker';
import TrackingEvent, {
  TrackingEventActions,
  TrackingEventCategories,
  TrackingEventNames,
} from '../../../util/TrackingEvent';
import O60HeroContent from 'app/component/organism/o60-hero-content/O60HeroContent';
import M02Button from '../../molecule/m02-button/M02Button';
import trackSliderItemsVisibility from 'app/util/trackSliderItemsVisibility';

export default class C12HeroSlider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c12-hero-slider';

  public readonly transitionController: C12HeroSliderTransitionController;

  private readonly slider = this.getElement('[data-slider]');
  private readonly slides = this.getElements('[data-slide]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly previousButtonComponent =
    this.previousButton && getComponentForElement<M02Button>(this.previousButton);
  private readonly nextButtonComponent =
    this.nextButton && getComponentForElement<M02Button>(this.nextButton);
  private readonly controls = this.getElement('[data-controls]');
  public isMobile: boolean = false;
  private app: App | null = null;
  private swiperInstance: Swiper | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C12HeroSliderTransitionController(this);
    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addEventListeners();
    this.initSlider();
    toggleControlsVisibility(this.controls, this.previousButton, this.nextButton);
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.addDisposableEventListener(window, 'resize', () =>
      toggleControlsVisibility(this.controls, this.previousButton, this.nextButton),
    );
  }

  public enterView() {
    super.enterView();
    this.trackVisibleSlides();
  }

  private trackVisibleSlides() {
    trackSliderItemsVisibility({
      componentId: this.componentId,
      componentName: this.displayName,
      slides: this.slides,
      titleSelectorName: '.a-heading',
    });
  }

  private get initialSlide(): number {
    const slideParam = new URLSearchParams(location.search).get('topic');
    if (!slideParam) return 0;

    const slide = this.slides
      .map((item, index) => ({
        element: item,
        index,
      }))
      .find((item) => {
        const dataTopic = item.element.dataset.topic;
        if (!dataTopic) return false;

        if (dataTopic === slideParam) return true;
      });

    if (!slide) return 0;

    return slide.index;
  }

  private initSlider(): void {
    if (this.slides.length === 0) {
      return console.warn('The slides for C12 were not provided');
    }

    this.controls?.classList.remove(StateClassNames.HIDDEN);
    Swiper.use([Navigation, Pagination]);

    if (this.slider) {
      this.swiperInstance = new Swiper(this.slider, {
        threshold: this.isMobile ? 0 : 2,
        noSwipingClass: 'm-button',
        centeredSlides: true,
        watchSlidesVisibility: true,
        slideVisibleClass: StateClassNames.VISIBLE,
        slidesPerView: 'auto',
        pagination: {
          bulletClass: 'a-pageIndicators__item',
          bulletElement: 'span',
          bulletActiveClass: StateClassNames.ACTIVE,
          currentClass: StateClassNames.ACTIVE,
          type: 'bullets',
          el: this.pagination,
        },
        navigation: {
          disabledClass: StateClassNames.DISABLED,
          nextEl: this.nextButton,
          prevEl: this.previousButton,
        },
        on: {
          afterInit: () => {
            this.trackSliderImpression(0);
          },
          slideChange: () => {
            this.previousButtonComponent?.updateAriaDisabled();
            this.nextButtonComponent?.updateAriaDisabled();
            this.trackVisibleSlides();
          },
          slideChangeTransitionStart: (swiper: Swiper) => {
            const { activeIndex } = swiper;

            const sliderTimeline = new TimelineMax({});

            const activeSlide = this.getElement(`.${StateClassNames.SWIPER_ACTIVE}`);
            const activeHeroContent = <HTMLElement>(activeSlide && activeSlide.firstElementChild);

            sliderTimeline.add(this.transitionController.getTimeline(activeHeroContent));

            this.trackSliderImpression(activeIndex);

            TrackingEvent({
              event: TrackingEventNames.SLIDER_INTERACTION,
              sliderAction: TrackingEventActions.SLIDER_CLICK,
              sliderCategory: TrackingEventCategories.SLIDER_INTERACTION,
              componentId: this.element.id,
              componentName: C12HeroSlider.displayName,
            });
          },
        },
        initialSlide: this.initialSlide,
      });
    }
  }

  private trackSliderImpression(slideIndex: number): void {
    const { topic } = this.slides[slideIndex].dataset;

    if (topic) {
      TrackingEvent({
        event: TrackingEventNames.SLIDER_IMPRESSION,
        slider: {
          slideTitleInEnglish: topic,
          slideOrder: slideIndex,
        },
        componentId: this.element.id,
        componentName: C12HeroSlider.displayName,
      });
    }
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.MEDIUM;
  }

  public dispose() {
    this.swiperInstance && this.swiperInstance.destroy();
    super.dispose();
  }
}
