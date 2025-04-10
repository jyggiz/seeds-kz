import Swiper from 'swiper';

import { StateClassNames } from '../../../../../data/enum/StateClassNames';
import { O119ModalSlider } from './O119ModalSlider';

export class O119ModalMobileSlider extends O119ModalSlider {
  private isPaginationBarInitialized: boolean = false;
  private paginationBarElement: HTMLElement | null = null;
  private paginationBarSwiper: Swiper | null = null;

  constructor(
    sliderElement: HTMLElement | null,
    slides: readonly HTMLLIElement[] = [],
    paginationBarList: readonly HTMLLIElement[] = [],
    titles: readonly HTMLDivElement[] = [],
    paginationElement: HTMLElement | null,
    paginationBarElement: HTMLElement | null,
  ) {
    super(sliderElement, slides, paginationBarList, titles, {
      pagination: {
        bulletClass: 'a-pageIndicators__item',
        bulletElement: 'span',
        bulletActiveClass: StateClassNames.ACTIVE,
        currentClass: StateClassNames.ACTIVE,
        el: paginationElement,
        type: 'bullets',
      },
    });

    this.paginationBarElement = paginationBarElement;
  }

  init() {
    super.init((index: number) => this.slideToPaginationBarByIndex(index));
    this.initPaginationBarSlider();
  }

  private initPaginationBarSlider(): void {
    if (this.isPaginationBarInitialized) return;

    if (this.paginationBarElement) {
      this.paginationBarSwiper = new Swiper(this.paginationBarElement, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 'auto',
        watchSlidesVisibility: true,
        slideVisibleClass: StateClassNames.VISIBLE,
        spaceBetween: 16,
        freeMode: true,
      });

      this.isPaginationBarInitialized = true;
    }
  }

  slideToPaginationBarByIndex(index: number): void {
    this.paginationBarSwiper?.slideTo(index);
  }

  destroy(): void {
    super.destroy();

    if (this.paginationBarSwiper) {
      this.paginationBarSwiper.destroy();
      this.paginationBarSwiper = null;
    }
  }
}
