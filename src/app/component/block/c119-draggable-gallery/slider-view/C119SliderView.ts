import Swiper, { Navigation } from 'swiper';
import { StateClassNames } from '../../../../data/enum/StateClassNames';
import { getComponentForElement } from 'muban-core';
import M02Button from '../../../molecule/m02-button/M02Button';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../../data/shared-variable/media-queries.json';
import deviceStateTracker from '../../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import AbstractTransitionComponent from '../../../AbstractTransitionComponent';
import C119SliderViewTransitionController from './C119SliderViewTransitionController';
import C119DraggableGalleryEvent from '../C119DraggableGalleryEvent';

import './C119SliderView.scss';

export default class C119SliderView extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c119-slider-view';

  public readonly transitionController: C119SliderViewTransitionController =
    new C119SliderViewTransitionController(this);

  private previousButton: HTMLDivElement | null = this.getElement(`[data-previous-button]`);
  private nextButton: HTMLDivElement | null = this.getElement(`[data-next-button]`);
  private readonly previousButtonComponent =
    this.previousButton && getComponentForElement<M02Button>(this.previousButton);
  private readonly nextButtonComponent =
    this.nextButton && getComponentForElement<M02Button>(this.nextButton);

  private pagination: HTMLDivElement | null = this.getElement('[data-pagination]');
  private modalButtons = this.getElements('[data-modal-cta]');

  private swiperContainer: HTMLDivElement | null = this.getElement('[data-swiper-container]');
  private swiperInstance: Swiper | null = null;
  private isMobile: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.initSlider();
    this.addEventListeners();
  }

  private initSlider() {
    const paginationBars =
      this.pagination && this.getElements('[data-pagination-bar]', this.pagination);

    paginationBars &&
      paginationBars.length &&
      paginationBars[0].classList.add(StateClassNames.ACTIVE);

    if (this.swiperContainer) {
      Swiper.use([Navigation]);

      this.swiperInstance = new Swiper(this.swiperContainer, {
        threshold: this.isMobile ? 0 : 2,
        direction: 'horizontal',
        loop: false,
        slidesPerView: 1,
        navigation: {
          disabledClass: StateClassNames.DISABLED,
          nextEl: this.nextButton,
          prevEl: this.previousButton,
        },
        on: {
          slideChange: (swiper) => {
            this.previousButtonComponent?.updateAriaDisabled();
            this.nextButtonComponent?.updateAriaDisabled();

            paginationBars &&
              paginationBars.forEach((bar, index) => {
                bar.classList.toggle(StateClassNames.ACTIVE, index === swiper.activeIndex);
              });
          },
        },
      });
    }
  }

  private addEventListeners() {
    this.modalButtons.forEach((button) => {
      this.addDisposableEventListener(button, 'click', () => {
        this.dispatcher.dispatchEvent(
          new C119DraggableGalleryEvent(C119DraggableGalleryEvent.OPEN_SLIDE_MODAL, button),
        );
      });
    });

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.MEDIUM;
  }

  public dispose() {
    this.swiperInstance && this.swiperInstance.destroy();
    super.dispose();
  }
}
