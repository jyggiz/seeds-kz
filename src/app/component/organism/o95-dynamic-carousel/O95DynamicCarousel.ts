import AbstractComponent from 'app/component/AbstractComponent';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { toggleControlsVisibility } from 'app/util/swiper/toggleControlsVisibility';
import Swiper, { Navigation, Pagination, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/types/shared';
import awaitElementComponent from '../../../util/getElementComponent';

type DefaultOptions = {
  pagination: SwiperOptions['pagination'];
  navigation: SwiperOptions['navigation'];
};

const SLIDE_ELEMENTS_ATTRIBUTES_EXCEPTION = 'data-text-card';

export default class O95DynamicCarousel extends AbstractComponent {
  public static readonly displayName: string = 'o95-dynamic-carousel';
  private readonly slider = this.getElement('[data-slider]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly controls = this.getElement('[data-controls]');
  private swiperInstance: null | Swiper = null;

  private readonly slides = this._slides;
  private readonly slidesComponents = this._slidesComponents;

  private defaultSwiperOptions: DefaultOptions = {
    navigation: {
      disabledClass: StateClassNames.DISABLED,
      nextEl: this.nextButton,
      prevEl: this.previousButton,
    },
    pagination: {
      bulletClass: 'a-pageIndicators__item',
      bulletElement: 'span',
      bulletActiveClass: StateClassNames.ACTIVE,
      currentClass: StateClassNames.ACTIVE,
      el: this.pagination,
      type: 'bullets',
    },
  };

  constructor(el: HTMLElement) {
    super(el);
    this.addEventListeners();

    toggleControlsVisibility(this.controls, this.previousButton, this.nextButton);
  }

  public initSlider(
    extraOptions: SwiperOptions = {},
    extraModules: Array<SwiperComponent> = [],
  ): Swiper | null {
    if (this.swiperInstance) {
      this.destroySlider();
    }

    Swiper.use([Navigation, Pagination, ...extraModules]);

    if (this.slider) {
      this.swiperInstance = new Swiper(this.slider, {
        ...this.defaultSwiperOptions,
        ...extraOptions,
      });
    }

    return this.swiperInstance;
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(window, 'resize', () =>
      toggleControlsVisibility(this.controls, this.previousButton, this.nextButton),
    );
  }

  //API methods
  public selectElements() {
    return this.slides;
  }

  public selectComponents() {
    return this.slidesComponents;
  }

  public destroySlider() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy();
      this.swiperInstance = null;
    }
  }

  //getters
  private get _slides() {
    const slides = this.getElements('[data-dynamic-slide]');
    if (slides.length === 0) {
      throw new Error('cannot find slides');
    }
    return slides.filter(
      (slide: HTMLElement) =>
        !slide.firstElementChild?.hasAttribute(SLIDE_ELEMENTS_ATTRIBUTES_EXCEPTION),
    );
  }

  private get _slidesComponents() {
    return (async () => {
      const components = (
        await Promise.all(
          this.slides.map((slide: HTMLElement) => {
            if (slide.firstElementChild) {
              return awaitElementComponent<AbstractTransitionComponent | AbstractComponent>(
                slide.firstElementChild as HTMLElement,
              );
            }
          }),
        )
      ).filter(
        (component): component is AbstractTransitionComponent | AbstractComponent =>
          component !== undefined,
      );

      if (this.slides.length !== components.length) {
        throw new Error(`Some slides don't have valid components`);
      }

      return components;
    })();
  }
}
