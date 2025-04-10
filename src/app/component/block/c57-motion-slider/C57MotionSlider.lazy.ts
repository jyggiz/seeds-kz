import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C57MotionSliderTransitionController from './C57MotionSliderTransitionController';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import Swiper, { Pagination } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { setAsInitialised } from 'app/util/setAsInitialised';
import trackSliderItemsVisibility from 'app/util/trackSliderItemsVisibility';
import O81MotionSlide from '../../organism/o81-motion-slide/O81MotionSlide.lazy';

import './c57-motion-slider.scss';

export default class C57MotionSlider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c57-motion-slider';

  public readonly transitionController: C57MotionSliderTransitionController;

  private slider = this.getElement('[data-slider]');
  private pagination = this.getElement('[data-slider-pagination]');
  private paginationBar = this.getElements('[data-pagination-bar]');
  private titles = this.getElements('[data-pagination-title]');
  private items = this.getElements('[data-item]');
  private images = this.getElements(`[data-image]`);

  private isMobile = deviceStateTracker.currentDeviceState.state < 2;
  private isTablet =
    deviceStateTracker.currentDeviceState.state > mq.deviceState.SMALL &&
    deviceStateTracker.currentDeviceState.state <= mq.deviceState.LARGE_LANDSCAPE;
  private swiperSlider: Swiper | undefined = undefined;
  private isSliderDestroyed: boolean = false;
  private isSliderInitiated: boolean = false;
  private slideMargin = 100;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C57MotionSliderTransitionController(this);
    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addEventListeners();

    this.paginationBar[0].classList.add(StateClassNames.ACTIVE);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    this.setSliderHeight();
  }

  public adopted() {
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
      slides: this.items,
      titleSelectorName: '.a-heading',
    });
  }

  private transformImage(index: number): void {
    if (this.isMobile) return;
    this.transitionController.slideInImage(index, this.images[index], 0.5);
  }

  private addEventListeners(): void {
    this.titles.forEach((title, index) => {
      title.addEventListener('click', () => {
        this.items.forEach((listItem, listItemindex) => {
          if (index === listItemindex) {
            if (!listItem.classList.contains(StateClassNames.ACTIVE)) {
              this.transformImage(index);
            }
            listItem.classList.add(StateClassNames.ACTIVE);
            if (this.paginationBar)
              this.paginationBar[listItemindex].classList.add(StateClassNames.ACTIVE);
          } else {
            this.paginationBar[listItemindex].classList.remove(StateClassNames.ACTIVE);
            listItem.classList.remove(StateClassNames.ACTIVE);
          }
        });
      });
    });
  }

  private initSlider() {
    if (this.isSliderInitiated) return;

    if (this.slider) {
      Swiper.use([Pagination]);

      this.swiperSlider = new Swiper(this.slider, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 'auto',
        watchSlidesVisibility: true,
        slideVisibleClass: StateClassNames.VISIBLE,
        spaceBetween: 0,
        on: {
          slideChange: () => {
            this.trackVisibleSlides();
          },
        },
        pagination: {
          bulletClass: 'a-pageIndicators__item',
          bulletElement: 'span',
          bulletActiveClass: StateClassNames.ACTIVE,
          currentClass: StateClassNames.ACTIVE,
          el: this.pagination,
          type: 'bullets',
        },
      });
      this.isSliderInitiated = true;
      this.isSliderDestroyed = false;
    }
  }

  private destroySlider() {
    if (this.isSliderDestroyed) return;

    if (this.swiperSlider) {
      this.swiperSlider.destroy();
      this.isSliderDestroyed = true;
      this.isSliderInitiated = false;
    }
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.SMALL;

    if (this.slider) {
      if (state < mq.deviceState.SMALL) {
        this.initSlider();
      } else {
        this.destroySlider();
      }
    }

    this.isTablet = state > mq.deviceState.SMALL && state <= mq.deviceState.LARGE_LANDSCAPE;
    this.setSliderHeight();
  }

  private setSliderHeight() {
    if (this.isTablet) {
      this.items.forEach((item) => {
        const motionSlide = this.getElement(
          `[data-component="${O81MotionSlide.displayName}"]`,
          item,
        );
        const motionSlideHeight = motionSlide?.getBoundingClientRect().height || 0;

        item.style.height = `${motionSlideHeight + this.slideMargin}px`;
        item.style.minHeight = '100%';
      });

      const largestItemHeight = this.items.reduce((largestItemHeight, current) => {
        const currentItemHeight = current.getBoundingClientRect().height;

        return largestItemHeight > currentItemHeight ? largestItemHeight : currentItemHeight;
      }, 0);

      this.element.style.minHeight = `${largestItemHeight}px`;
    } else {
      this.element.style.removeProperty('min-height');

      this.items.forEach((item) => {
        item.style.removeProperty('height');
        item.style.removeProperty('min-height');
      });
    }
  }
}
