import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O82GenericSliderTransitionController from './O82GenericSliderTransitionController';
import Swiper, { Navigation, Pagination } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { toggleControlsVisibility } from '../../../util/swiper/toggleControlsVisibility';
import { updateClassForItems } from '../../../util/stateClassNamesToggle';
import trackSliderItemsVisibility from 'app/util/trackSliderItemsVisibility';

import './o82-generic-slider.scss';
export default class O82GenericSlider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o82-generic-slider';

  public readonly transitionController: O82GenericSliderTransitionController;

  private inSwipe = false;

  private app: App | null = null;

  private readonly slider = this.getElement('[data-slider]');
  private sliderListItems = [...this.getElements('[data-slider-item]')];
  private sliderList = this.getElement('[data-slider-items]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly controls = this.getElement('[data-controls]');

  private readonly sorterItems = this.getElements('[data-sorter-item]');
  private swiperInstance: Swiper | null = null;

  private readonly activeSorterItem = this.sorterItems.find((item) =>
    item.classList.contains(StateClassNames.ACTIVE),
  );
  private selectedAssetType: object = {};

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O82GenericSliderTransitionController(this);

    this.addEventListeners();
    this.initSlider();
    toggleControlsVisibility(this.controls, this.previousButton, this.nextButton);
  }

  public async adopted() {
    if (!window.location.href.includes('viewMode=story')) {
      this.app = await getAppComponent();
    }
  }

  public enterView() {
    super.enterView();
    this.trackVisibleSlides();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(window, 'resize', () =>
      toggleControlsVisibility(this.controls, this.previousButton, this.nextButton),
    );

    this.sorterItems.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.handleSorterItems(item, index);
        this.flipCardOrder();
      });
    });
  }

  private handleSorterItems(item: HTMLElement, index: number): void {
    updateClassForItems({
      removeFrom: this.sorterItems,
      className: StateClassNames.ACTIVE,
    });

    this.sorterItems.length && this.selectAssetType(item, index);
  }

  private trackVisibleSlides() {
    trackSliderItemsVisibility({
      componentId: this.componentId,
      componentName: this.displayName,
      slides: this.sliderListItems,
      titleSelectorName: '.o-updateCard__text',
    });
  }

  private selectAssetType(item: HTMLElement, index: number): void {
    updateClassForItems({
      removeFrom: this.sorterItems,
      addToOne: this.sorterItems[index],
      className: StateClassNames.ACTIVE,
    });

    const { category } = item.dataset;
    const { value, label } = item.dataset.option && JSON.parse(item.dataset.option);
    if (category && item.classList.contains(StateClassNames.ACTIVE)) {
      Object.assign(this.selectedAssetType, { assetType: value, label: label, value: value });
    }
  }

  private flipCardOrder() {
    this.destroySlider();

    if (this.sliderList) {
      this.sliderList.innerHTML = '';
    }

    this.sliderListItems.reverse().forEach((item) => {
      if (this.sliderList) {
        this.sliderList.appendChild(item);
      }
    });

    this.transitionController.animateIn();
    this.initSlider();
  }

  private initSlider(): void {
    if (this.slider) {
      Swiper.use([Navigation, Pagination]);

      this.swiperInstance = new Swiper(this.slider, {
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
          slideChange: this.trackVisibleSlides.bind(this),
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

  private destroySlider() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy();
      this.swiperInstance = null;
    }
  }

  public dispose() {
    super.dispose();
  }
}
