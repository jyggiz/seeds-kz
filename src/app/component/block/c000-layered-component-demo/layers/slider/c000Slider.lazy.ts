import AbstractComponent from 'app/component/AbstractComponent';
import O95DynamicCarousel from 'app/component/organism/o95-dynamic-carousel/O95DynamicCarousel';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import deviceStateTracker from 'app/util/deviceStateTracker';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { getComponentForElement } from 'muban-core';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../../../data/shared-variable/media-queries.json';
import { SliderComponents } from '../../C000LayeredComponentDemo.types';

import './c000-slider.scss';

export default class C000Slider extends AbstractComponent {
  public static readonly displayName: string = 'c000-slider';

  private readonly carouselComponent = this._carouselComponent;

  constructor(el: HTMLElement) {
    super(el);

    this.setSliderState(deviceStateTracker.currentDeviceState);

    this.activateSlide(0);

    this.addEventListeners();
  }

  private activateSlide(index: number) {
    const slide = this.carouselComponent.selectElements()[index];

    slide?.classList.add(StateClassNames.ACTIVE);
  }

  private addEventListeners() {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.setSliderState(event.data),
    );
  }

  private setSliderState({ state }: IDeviceStateData): void {
    if (state <= mq.deviceState.SMALL) {
      this.carouselComponent.initSlider({
        direction: 'horizontal',
        loop: false,
        slidesPerView: 'auto',
        spaceBetween: 0,
      });
    } else {
      this.carouselComponent.destroySlider();
    }
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  // API methods
  public selectElements() {
    return this.carouselComponent.selectElements();
  }

  public selectComponents() {
    return this.carouselComponent.selectComponents();
  }

  public async transitionInSlide(index: number) {
    const slideComponent = (await this.carouselComponent.selectComponents())[index];

    if ('transitionIn' in slideComponent && typeof slideComponent.transitionIn === 'function') {
      slideComponent.transitionController.transitionInTimeline.restart();
    }
  }

  // getters
  private get _carouselComponent() {
    const o95Element = this.getElement(`[data-component="${SliderComponents.O95}"]`);

    if (o95Element) {
      const o95Component = o95Element && getComponentForElement<O95DynamicCarousel>(o95Element);
      return o95Component;
    }

    throw new Error('could not get carousel instance');
  }
}
