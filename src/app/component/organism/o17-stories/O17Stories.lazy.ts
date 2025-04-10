import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import Swiper, { Pagination } from 'swiper';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { StateClassNames } from '../../../data/enum/StateClassNames';

import './o17-stories.scss';

export default class O17Stories extends AbstractTransitionBlock {
  public static readonly displayName: string = 'o17-stories';

  private readonly slider = this.getElement('[data-slider]');
  private readonly pagination = this.getElement('[data-slider-pagination]');

  private swiperSlider: Swiper | undefined = undefined;

  private isDestroyed: boolean = false;
  private isInited: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);
  }

  private initSlider() {
    if (this.isInited) return;

    if (this.slider) {
      Swiper.use([Pagination]);

      this.swiperSlider = new Swiper(this.slider, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 1.2,
        spaceBetween: 20,
        pagination: {
          bulletClass: 'a-pageIndicators__item',
          bulletElement: 'span',
          bulletActiveClass: StateClassNames.ACTIVE,
          currentClass: StateClassNames.ACTIVE,
          el: this.pagination,
          type: 'bullets',
        },
      });
      this.isInited = true;
      this.isDestroyed = false;
    }
  }

  private destroySlider() {
    if (this.isDestroyed) return;

    if (this.swiperSlider) {
      this.swiperSlider.destroy();
      this.isDestroyed = true;
      this.isInited = false;
    }
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    if (state > mq.deviceState.SMALL) {
      this.destroySlider();
    } else {
      this.initSlider();
    }
  }

  public dispose() {
    super.dispose();
  }
}
