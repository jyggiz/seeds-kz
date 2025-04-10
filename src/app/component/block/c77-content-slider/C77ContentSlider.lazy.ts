import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C77ContentSliderTransitionController from './C77ContentSliderTransitionController';
import Swiper, { Navigation } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c77-content-slider.scss';

export default class C77ContentSlider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c77-content-slider';

  public readonly transitionController: C77ContentSliderTransitionController;

  private swiperContainer: HTMLDivElement | null = this.getElement('[data-swiper-container]');

  private swiperInstance: Swiper | null = null;

  private previousButton: HTMLDivElement | null = this.getElement(`[data-previous-button]`);

  private nextButton: HTMLDivElement | null = this.getElement(`[data-next-button]`);

  private pagination: HTMLDivElement | null = this.getElement('[data-pagination]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C77ContentSliderTransitionController(this);

    this.initSlider();
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private initSlider() {
    if (this.swiperContainer) {
      Swiper.use([Navigation]);

      this.swiperInstance = new Swiper(this.swiperContainer, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 1,
        navigation: {
          disabledClass: StateClassNames.DISABLED,
          nextEl: this.nextButton,
          prevEl: this.previousButton,
        },
      });

      const paginationBars =
        this.pagination && this.getElements('[data-pagination-bar]', this.pagination);

      paginationBars &&
        paginationBars.length &&
        paginationBars[0].classList.add(StateClassNames.ACTIVE);

      this.swiperInstance.on('slideChange', (swiper) => {
        const slideIndex = swiper.activeIndex;

        paginationBars &&
          paginationBars.forEach((bar, barIndex) => {
            if (barIndex === slideIndex) {
              bar.classList.add(StateClassNames.ACTIVE);
            } else {
              bar.classList.remove(StateClassNames.ACTIVE);
            }
          });
      });
    }
  }
}
