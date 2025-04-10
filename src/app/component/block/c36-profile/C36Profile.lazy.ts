import { getComponentForElement } from 'muban-core';
import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C36ProfileTransitionController from './C36ProfileTransitionController';
import Swiper, { Navigation, Pagination, Scrollbar } from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { setAsInitialised } from 'app/util/setAsInitialised';
import M02Button from '../../molecule/m02-button/M02Button';
import trackSliderItemsVisibility from 'app/util/trackSliderItemsVisibility';

import './c36-profile.scss';

export default class C36Profile extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c36-profile';

  public readonly transitionController: C36ProfileTransitionController;

  private readonly slider = this.getElement('[data-slider]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly slides = this.getElements('.swiper-slide');
  private readonly previousButtonComponent =
    this.previousButton && getComponentForElement<M02Button>(this.previousButton);
  private readonly nextButtonComponent =
    this.nextButton && getComponentForElement<M02Button>(this.nextButton);

  private swiperSlider: Swiper | undefined = undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C36ProfileTransitionController(this);

    this.initSlider();
    this.addEventListeners();
    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);
  }

  private onDeviceStateChange({ state }: IDeviceStateData) {
    if (this.swiperSlider && this.slides.length) {
      if (state > mq.deviceState.MEDIUM && this.slides.length <= 2) {
        this.swiperSlider.allowTouchMove = false;
        this.swiperSlider.activeIndex = 0;
      } else {
        this.swiperSlider.allowTouchMove = true;
      }
    }
  }

  private addEventListeners() {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
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
      slides: this.slides,
      titleSelectorName: '.m-personCard__name',
    });
  }

  private initSlider(): void {
    if (this.slider) {
      Swiper.use([Navigation, Pagination]);

      const isSmallViewport = deviceStateTracker.currentDeviceState < mq.deviceState.LARGE;

      this.swiperSlider = new Swiper(this.slider, {
        threshold: isSmallViewport ? 0 : 2,
        direction: 'horizontal',
        loop: false,
        slidesPerView: 1.2,
        spaceBetween: 40,
        watchSlidesVisibility: true,
        slideVisibleClass: StateClassNames.VISIBLE,
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
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 30,
            slidesOffsetAfter: 360,
          },
          1240: {
            slidesPerView: 2.5,
            spaceBetween: 60,
            slidesOffsetAfter: 550,
          },
          1440: {
            slidesPerView: 2.5,
            spaceBetween: 60,
            slidesOffsetAfter: 615,
          },
          1600: {
            slidesPerView: 2.5,
            spaceBetween: 60,
            slidesOffsetAfter: 690,
          },
        },
      });
    }
  }
}
