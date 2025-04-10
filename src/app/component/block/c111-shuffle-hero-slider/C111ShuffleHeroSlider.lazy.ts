import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C111ShuffleHeroSliderTransitionController from './C111ShuffleHeroSliderTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O95DynamicCarousel from 'app/component/organism/o95-dynamic-carousel/O95DynamicCarousel';
import { getComponentForElement } from 'muban-core';
import Swiper, { EffectCoverflow, SwiperOptions } from 'swiper';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import App from 'app/component/layout/app/App';
import { MODAL } from 'app/util/overlayActionTypes';
import { getAppComponent } from 'app/util/getElementComponent';
import trackSliderItemsVisibility from 'app/util/trackSliderItemsVisibility';

import './c111-shuffle-hero-slider.scss';

const lazyC111ModalTemplate = () =>
  import('./component/modal/c111-modal-window.hbs?include') as LoadTemplateImport<any>;

export default class C111ShuffleHeroSlider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c111-shuffle-hero-slider';

  public readonly transitionController: C111ShuffleHeroSliderTransitionController;
  private readonly slideLabels = this.getElements('[data-slide-label');
  private readonly slides = this.getElements('[data-slide]');
  private readonly minimapItems = this.getElements('[data-minimap-item]');
  private readonly carouselElement = this.getElement(
    `[data-component="${O95DynamicCarousel.displayName}"]`,
  );
  private currentActiveSlide = 0;
  private readonly modalOpenButtons = this.getElements<HTMLButtonElement>(
    '[data-modal-open-button]',
  );
  private readonly dynamicCarousel =
    this.carouselElement && getComponentForElement<O95DynamicCarousel>(this.carouselElement);
  private swiperInstance: Swiper | null = null;
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C111ShuffleHeroSliderTransitionController(this);
    this.initSlider();
    this.addEventListener();
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();
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

  private addEventListener() {
    this.slideLabels.forEach((label, index) => {
      this.addDisposableEventListener(label, 'mouseenter', () => {
        this.swiperInstance?.slideTo(index);
      });
    });

    this.minimapItems.forEach((item, index) => {
      this.addDisposableEventListener(item, 'mouseenter', () => {
        this.swiperInstance?.slideTo(index);
      });
    });

    this.modalOpenButtons.forEach((button) => {
      this.addDisposableEventListener(button, 'click', () => {
        this.openModal(button);
      });
    });
  }

  private async openModal(button: HTMLButtonElement) {
    const data = button.dataset.modal && JSON.parse(button.dataset.modal);
    if (!data) return;

    const [c111Template, overlay] = await Promise.all([lazyC111ModalTemplate(), this.app?.overlay]);
    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: c111Template.default,
        data,
        options: {
          classnames: ['-fullWidth'],
        },
      },
    });
  }

  private initSlider() {
    const extraSwiperOptions: SwiperOptions = {
      effect: 'coverflow',
      direction: 'vertical',
      centeredSlides: true,
      watchSlidesVisibility: true,
      slideVisibleClass: StateClassNames.VISIBLE,
      slidesPerView: 'auto',
      on: {
        slideChange: (swiper) => {
          this.switchActiveState(this.slideLabels, this.currentActiveSlide, swiper.activeIndex);
          this.switchActiveState(this.minimapItems, this.currentActiveSlide, swiper.activeIndex);
          this.currentActiveSlide = swiper.activeIndex;
          this.trackVisibleSlides();
        },
      },
      coverflowEffect: {
        rotate: -5,
        stretch: 420,
        depth: 50,
        modifier: 1,
      },
      breakpoints: {
        480: {
          coverflowEffect: {
            stretch: 220,
          },
        },
        768: {
          coverflowEffect: {
            stretch: 350,
          },
        },
        1024: {
          coverflowEffect: {
            stretch: 520,
          },
        },
      },
    };
    if (this.dynamicCarousel) {
      this.swiperInstance = this.dynamicCarousel.initSlider(extraSwiperOptions, [EffectCoverflow]);
    }
  }

  private switchActiveState(
    items: readonly HTMLElement[],
    previusActiveIndex: number,
    currentActiveIndex: number,
  ) {
    items[previusActiveIndex].classList.remove(StateClassNames.ACTIVE);
    items[currentActiveIndex].classList.add(StateClassNames.ACTIVE);
  }
}
