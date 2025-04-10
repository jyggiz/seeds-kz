import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C75ImageGridTransitionController from './C75ImageGridTransitionController';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import Swiper, { Pagination } from 'swiper';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c75-image-grid.scss';

export default class C75ImageGrid extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c75-image-grid';

  public readonly transitionController: C75ImageGridTransitionController;

  private slider = this.getElement('[data-slider]');
  private pagination = this.getElement('[data-slider-pagination]');
  private items = this.getElements('[data-item]');

  private swiperSlider: Swiper | undefined = undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C75ImageGridTransitionController(this);

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private initSlider() {
    if (this.slider && !this.swiperSlider) {
      Swiper.use([Pagination]);

      this.swiperSlider = new Swiper(this.slider, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 0,
        pagination: {
          bulletClass: 'a-pageIndicators__item',
          bulletElement: 'span',
          bulletActiveClass: StateClassNames.ACTIVE,
          currentClass: StateClassNames.ACTIVE,
          el: this.pagination,
          type: 'bullets',
        },
      });
    }
  }

  private destroySlider() {
    if (this.swiperSlider) {
      this.swiperSlider.destroy();
      this.swiperSlider = undefined;
    }
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    if (this.slider) {
      if (state > mq.deviceState.SMALL) {
        this.destroySlider();
      } else {
        this.initSlider();
      }
    }
  }
}
