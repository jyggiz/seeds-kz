import Swiper, { Pagination, SwiperOptions } from 'swiper';

import { StateClassNames } from '../../../../../data/enum/StateClassNames';

export class O119ModalSlider {
  private isInitialized: boolean = false;
  private paginationBarList: readonly HTMLLIElement[] = [];
  private sliderElement: HTMLElement | null = null;
  private slides: readonly HTMLLIElement[] = [];
  private swiper: Swiper | null = null;
  private swiperOptions: SwiperOptions = {};

  public titles: readonly HTMLDivElement[] = [];

  constructor(
    sliderElement: HTMLElement | null = null,
    slides: readonly HTMLLIElement[] = [],
    paginationBarList: readonly HTMLLIElement[] = [],
    titles: readonly HTMLDivElement[] = [],
    swiperOptions?: SwiperOptions,
  ) {
    this.sliderElement = sliderElement;
    this.swiperOptions = swiperOptions || {};
    this.slides = slides;
    this.paginationBarList = paginationBarList;
    this.titles = titles;
  }

  init(onSlideChange?: (index: number) => void): void {
    if (this.isInitialized) return;

    if (this.sliderElement) {
      if (this.swiperOptions.pagination) {
        Swiper.use([Pagination]);
      }

      this.swiper = new Swiper(this.sliderElement, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 'auto',
        watchSlidesVisibility: true,
        slideVisibleClass: StateClassNames.VISIBLE,
        spaceBetween: 0,
        on: {
          slideChange: (swiper) => {
            const slideIndex = swiper.activeIndex;
            onSlideChange?.(slideIndex);

            this.paginationBarList?.forEach((bar, barIndex) => {
              bar.classList.toggle(StateClassNames.ACTIVE, barIndex === slideIndex);
            });
          },
        },
        ...this.swiperOptions,
      });

      if (this.paginationBarList && this.paginationBarList.length > 0) {
        this.paginationBarList[0].classList.add(StateClassNames.ACTIVE);
      }

      this.isInitialized = true;
    }
  }

  onTitleClick(newActiveSlideIndex: number): void {
    this.slides.forEach((_, currentSlideIndex) => {
      if (newActiveSlideIndex === currentSlideIndex) {
        this.paginationBarList?.[newActiveSlideIndex].classList.add(StateClassNames.ACTIVE);
        this.swiper?.slideTo(newActiveSlideIndex);
      } else {
        this.paginationBarList?.[currentSlideIndex].classList.remove(StateClassNames.ACTIVE);
      }
    });
  }

  destroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
      this.swiper = null;
    }
  }
}
