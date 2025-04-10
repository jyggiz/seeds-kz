import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C33GroupedContentSliderTransitionController from './C33GroupedContentSliderTransitionController';
import Swiper, { Navigation, Pagination } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { PaginationOptions } from 'swiper/types/components/pagination';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import O78TimelineCard from '../../organism/o78-timeline-card/O78TimelineCard.lazy';
import { updateClassForItems } from '../../../util/stateClassNamesToggle';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c33-grouped-content-slider.scss';

export default class C33GroupedContentSlider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c33-grouped-content-slider';

  public readonly transitionController: C33GroupedContentSliderTransitionController;

  private readonly slider = this.getElement('[data-slider]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly paginationMobile = this.getElement('[data-slider-pagination]');
  private readonly paginationDesktop = this.getElement('[data-slider-pagination-desktop]');
  private readonly cards = this.getElements(`[data-component="${O78TimelineCard.displayName}"]`);
  private readonly controls = this.getElement('[data-controls]');
  private progressBar: HTMLElement | null = null;
  private MINIMUM_REQUIRED_SLIDES: number = 4;
  private SLIDER_MARGIN: number = 26;

  public isMobile: boolean = false;
  private swiperInstance: Swiper | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C33GroupedContentSliderTransitionController(this);
    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addEventListeners();

    this.cards[0].classList.add(StateClassNames.ACTIVE);

    if (
      this.cards.length < this.MINIMUM_REQUIRED_SLIDES &&
      this.slider &&
      this.isContentFitted(this.slider)
    ) {
      this.initStaticSlider();
    } else {
      this.initSlider();
    }
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  private isContentFitted(element: HTMLElement): boolean {
    return element.offsetWidth + this.SLIDER_MARGIN <= window.innerWidth;
  }

  private toggleActiveClass(item: HTMLElement, index: number): void {
    if (item.classList.contains(StateClassNames.ACTIVE)) return;

    updateClassForItems({
      removeFrom: this.cards,
      addToOne: this.cards[index],
      className: StateClassNames.ACTIVE,
    });
  }

  private initStaticSlider(): void {
    this.slider?.classList.add('-staticContentSlider');

    this.paginationDesktop?.classList.add(StateClassNames.HIDDEN);
    this.controls?.classList.add(StateClassNames.HIDDEN);

    this.cards.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => this.toggleActiveClass(item, index));
    });
  }

  private initSlider(): void {
    Swiper.use([Navigation, Pagination]);

    if (this.slider) {
      if (this.paginationDesktop && this.controls) {
        this.paginationDesktop.style.display = this.isMobile ? 'none' : 'block';
        this.controls.style.display = this.isMobile ? 'none' : 'block';
      }

      if (this.paginationMobile && this.controls) {
        this.paginationMobile.style.display = this.isMobile ? 'flex' : 'none';
        this.controls.style.display = this.isMobile ? 'none' : 'block';
      }

      const paginationOptions = this.getPaginationOptions();
      const totalItems = this.cards.length;
      const cardInView = window.innerWidth / (this.cards[0].clientWidth + 25);

      this.swiperInstance = new Swiper(this.slider, {
        slideToClickedSlide: true,
        slidesPerView: cardInView,
        spaceBetween: 30,
        slidesOffsetAfter: cardInView * 120,
        noSwipingClass: 'm-button',
        navigation: {
          disabledClass: StateClassNames.DISABLED,
          nextEl: this.nextButton,
          prevEl: this.previousButton,
        },
        pagination: paginationOptions,
        breakpoints: {
          300: {
            slidesPerView: Math.min(1, totalItems),
            spaceBetween: 30,
            slidesOffsetAfter: 0,
          },
          530: {
            slidesPerView: Math.min(2, totalItems),
            spaceBetween: 30,
            slidesOffsetAfter: Math.min(2, totalItems) * 60,
          },
          768: {
            slidesPerView: Math.min(2, totalItems),
            spaceBetween: 30,
            slidesOffsetAfter: Math.min(2, totalItems) * 120,
          },
          871: {
            slidesPerView: Math.min(2, totalItems),
            spaceBetween: 30,
            slidesOffsetAfter: Math.min(2, totalItems) * 180,
          },
          1024: {
            slidesPerView: Math.min(2.5, totalItems),
            spaceBetween: 30,
            slidesOffsetAfter: Math.min(2.5, totalItems) * 220,
          },
          1240: {
            slidesPerView: Math.min(3, totalItems),
            spaceBetween: 60,
            slidesOffsetAfter: Math.min(3, totalItems) * 220,
          },
          1440: {
            slidesPerView: Math.min(3.5, totalItems),
            spaceBetween: 60,
            slidesOffsetAfter: Math.min(3.5, totalItems) * 280,
          },
          1600: {
            slidesPerView: Math.min(4, totalItems),
            spaceBetween: 60,
            slidesOffsetAfter: Math.min(4, totalItems) * 280,
          },
        },
        on: {
          slideChangeTransitionStart: (swiper: Swiper) => {
            const { activeIndex } = swiper;

            updateClassForItems({
              removeFrom: this.cards,
              addToOne: this.cards[activeIndex],
              className: StateClassNames.ACTIVE,
            });
          },
          slideChange: (swiper: Swiper) => {
            const { activeIndex, slides } = swiper;

            if (this.progressBar) {
              this.progressBar.style.transform = `translate3d(0px, 0px, 0px) scaleX(${
                (activeIndex + 1) / slides.length
              }) scaleY(1)`;
            }

            this.nextButton?.classList.toggle(
              StateClassNames.DISABLED,
              activeIndex === totalItems - 1,
            );
            this.previousButton?.classList.toggle(StateClassNames.DISABLED, activeIndex === 0);
          },
          init: () => {
            if (!this.isMobile) {
              this.initSlidesEventListener();
            }
          },
        },
      });
    }

    this.progressBar = this.getElement<HTMLElement>('.swiper-pagination-progressbar-fill');
    this.progressBar?.classList.add('b-heroSlider__paginationProgress');
  }

  private getPaginationOptions(): PaginationOptions {
    let paginationOptions = {};

    if (this.isMobile) {
      paginationOptions = {
        bulletClass: 'a-pageIndicators__item',
        bulletElement: 'span',
        bulletActiveClass: StateClassNames.ACTIVE,
        currentClass: StateClassNames.ACTIVE,
      };
    }

    return {
      ...paginationOptions,
      el: this.isMobile ? this.paginationMobile : this.paginationDesktop,
      type: this.isMobile ? 'bullets' : 'progressbar',
    };
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.MEDIUM;
  }

  private initSlidesEventListener(): void {
    const slides = this.getElements<HTMLElement>(
      `.swiper-slide [data-component="${O78TimelineCard.displayName}"]`,
    );

    slides.forEach((slide, index) => {
      this.addDisposableEventListener(slide, 'click', () => {
        this.swiperInstance?.slideTo(index);
      });
    });
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  public dispose() {
    this.swiperInstance && this.swiperInstance.destroy();
    super.dispose();
  }
}
