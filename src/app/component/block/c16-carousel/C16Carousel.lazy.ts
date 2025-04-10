import { getComponentForElement } from 'muban-core';
import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C16CarouselTransitionController from './C16CarouselTransitionController';
import Swiper, { Navigation, Pagination } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { toggleControlsVisibility } from 'app/util/swiper/toggleControlsVisibility';
import { setAsInitialised } from 'app/util/setAsInitialised';
import M02Button from '../../molecule/m02-button/M02Button';
import trackSliderItemsVisibility from 'app/util/trackSliderItemsVisibility';

import './c16-carousel.scss';

export default class C16Carousel extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c16-carousel';

  public readonly transitionController: C16CarouselTransitionController;

  private readonly slider = this.getElement('[data-slider]');
  private readonly slides = this.getElements('.swiper-slide');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly controls = this.getElement('[data-controls]');

  private readonly previousButtonComponent =
    this.previousButton && getComponentForElement<M02Button>(this.previousButton);
  private readonly nextButtonComponent =
    this.nextButton && getComponentForElement<M02Button>(this.nextButton);

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new C16CarouselTransitionController(this);

    this.addEventListeners();
    this.initSlider();
    toggleControlsVisibility(this.controls, this.previousButton, this.nextButton);
  }

  public async adopted() {
    setAsInitialised(this.element);
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
      titleSelectorName: '.o-updateCard__title',
    });
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(window, 'resize', () =>
      toggleControlsVisibility(this.controls, this.previousButton, this.nextButton),
    );
  }

  private initSlider(): void {
    Swiper.use([Navigation, Pagination]);

    if (this.slider) {
      const swiper = new Swiper(this.slider, {
        loop: false,
        direction: 'horizontal',
        slidesPerView: 'auto',
        watchSlidesVisibility: true,
        slideVisibleClass: StateClassNames.VISIBLE,
        spaceBetween: 30,
        navigation: {
          disabledClass: StateClassNames.DISABLED,
          nextEl: this.nextButton,
          prevEl: this.previousButton,
        },
        pagination: {
          el: this.pagination,
          dynamicBullets: true,
          dynamicMainBullets: 4,
        },
        on: {
          paginationUpdate: () => {
            this.previousButtonComponent?.updateAriaDisabled();
            this.nextButtonComponent?.updateAriaDisabled();
          },
          slideChange: () => {
            this.trackVisibleSlides();
          },
        },
        breakpoints: {
          768: {
            spaceBetween: 70,
            freeMode: true,
            freeModeMinimumVelocity: 0.02,
            threshold: 5,
          },
        },
      });
    }
  }

  public dispose() {
    super.dispose();
  }
}
