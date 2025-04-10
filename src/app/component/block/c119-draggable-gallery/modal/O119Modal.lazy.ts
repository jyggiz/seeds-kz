import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import deviceStateTracker from '../../../../util/deviceStateTracker';
import mq from '../../../../data/shared-variable/media-queries.json';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import M48SliderPagination from '../../../molecule/m48-slider-pagination/M48SliderPagination';
import { O119ModalSlider } from './models/O119ModalSlider';
import { O119ModalMobileSlider } from './models/O119ModalMobileSlider';

import './o119-modal.scss';

export default class O119Modal extends AbstractComponent {
  public static readonly displayName: string = 'o119-modal';

  private mobileSlider = this.getElement('[data-slider-mobile]');
  private desktopSlider = this.getElement('[data-slider-desktop]');
  private mobilePaginationBarSlider = this.getElement(
    `[data-mobile-content] [data-component=${M48SliderPagination.displayName}]`,
  );

  private pagination = this.getElement('[data-slider-pagination]');
  private mobilePaginationBar = this.getElements<HTMLLIElement>(
    '[data-mobile-content] [data-pagination-bar]',
  );
  private desktopPaginationBar = this.getElements<HTMLLIElement>(
    '[data-desktop-content] [data-pagination-bar]',
  );
  private mobileTitles = this.getElements<HTMLDivElement>(
    '[data-mobile-content] [data-pagination-title]',
  );
  private desktopTitles = this.getElements<HTMLDivElement>(
    '[data-desktop-content] [data-pagination-title]',
  );
  private mobileSlides = this.getElements<HTMLLIElement>('[data-item-mobile]');
  private desktopSlides = this.getElements<HTMLLIElement>('[data-item-desktop]');

  private slider: O119ModalSlider | null = null;

  private isMobileSliderInitialized: boolean = false;
  private isDesktopSliderInitialized: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.initSlider(deviceStateTracker.currentDeviceState.state < mq.deviceState.MEDIUM);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private addEventListeners(slider: O119ModalSlider): void {
    slider.titles.forEach((slideTitle, index) => {
      this.addDisposableEventListener(slideTitle, 'click', () => {
        slider.onTitleClick(index);
      });
    });
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.initSlider(state < mq.deviceState.MEDIUM);
  }

  private initSlider(isMobile: boolean): void {
    if (isMobile && !this.isMobileSliderInitialized) {
      this.slider = new O119ModalMobileSlider(
        this.mobileSlider,
        this.mobileSlides,
        this.mobilePaginationBar,
        this.mobileTitles,
        this.pagination,
        this.mobilePaginationBarSlider,
      );

      this.isMobileSliderInitialized = true;
    }

    if (!isMobile && !this.isDesktopSliderInitialized) {
      this.slider = new O119ModalSlider(
        this.desktopSlider,
        this.desktopSlides,
        this.desktopPaginationBar,
        this.desktopTitles,
      );

      this.isDesktopSliderInitialized = true;
    }

    this.slider?.init();
    this.slider && this.addEventListeners(this.slider);
  }

  public dispose() {
    this.slider?.destroy();
    super.dispose();
  }
}
