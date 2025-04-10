import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import App from 'app/component/layout/app/App';
import O39LightboxContentProps from 'app/component/organism/o39-lightbox-content/O39LightboxContent.types';
import O95DynamicCarousel from 'app/component/organism/o95-dynamic-carousel/O95DynamicCarousel';
import deviceStateTracker from 'app/util/deviceStateTracker';
import { getAppComponent } from 'app/util/getElementComponent';
import { LIGHTBOX } from 'app/util/overlayActionTypes';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { getComponentForElement } from 'muban-core';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import Swiper, { SwiperOptions } from 'swiper';
import mq from '../../../data/shared-variable/media-queries.json';

import './c113-simple-card-carousel.scss';
import C113SimpleCardCarouselTransitionController from './C113SimpleCardCarouselTransitionController';
import trackSliderItemsVisibility from 'app/util/trackSliderItemsVisibility';
import { StateClassNames } from 'app/data/enum/StateClassNames';

const lazyO39Template = () =>
  import(
    '../../organism/o39-lightbox-content/o39-lightbox-content.hbs?include'
  ) as LoadTemplateImport<O39LightboxContentProps>;

export default class C113SimpleCardCarousel extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c113-simple-card-carousel';
  private app: App | null = null;
  private readonly slides = this.getElements('.swiper-slide');
  private swiperInstance: Swiper | null = null;
  private readonly container = this.getElement('[data-container]');
  private readonly lightboxItems = this.getElements(`[data-lightbox-item]`);
  private readonly lightboxData = this._lightboxData;
  private readonly carouselElement = this.getElement(
    `[data-component="${O95DynamicCarousel.displayName}"]`,
  );
  private readonly dynamicCarousel =
    this.carouselElement && getComponentForElement<O95DynamicCarousel>(this.carouselElement);
  private readonly textCard = this.getElement('[data-text-card]');
  private readonly textCardParentElement = this.textCard?.parentElement;
  private isMobile = deviceStateTracker.currentDeviceState.state <= mq.deviceState.MEDIUM;
  public readonly transitionController: C113SimpleCardCarouselTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C113SimpleCardCarouselTransitionController(this);
    this.initSlider();
    this.positionSliderControls();
    this.setTextContentSlidePlacement();
    this.addEventListeners();
  }

  private addEventListeners() {
    this.lightboxItems.forEach((item, index) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.openLightbox(index);
      });
    });

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
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

  private initSlider() {
    const extraSwiperOptions: SwiperOptions = {
      loop: false,
      direction: 'horizontal',
      slidesPerView: 'auto',
      spaceBetween: 30,
      grabCursor: true,
      watchSlidesVisibility: true,
      slideVisibleClass: StateClassNames.VISIBLE,
      on: {
        slideChange: this.trackVisibleSlides.bind(this),
      },
      breakpoints: {
        1024: {
          spaceBetween: 70,
          freeMode: true,
          freeModeMinimumVelocity: 0.02,
          threshold: 5,
        },
      },
    };
    if (this.dynamicCarousel) {
      this.swiperInstance = this.dynamicCarousel.initSlider(extraSwiperOptions);
    }
  }

  private async openLightbox(index: number): Promise<void> {
    if (this.app === null) throw new Error('App was not found');

    const content = {
      items: this.lightboxData,
    };

    const data = { content, index };

    const [template, overlay] = await Promise.all([lazyO39Template(), this.app.overlay]);

    await overlay.dispatchAction({
      type: LIGHTBOX.STANDARD_DYNAMIC,
      payload: {
        template: template.default,
        data,
      },
    });
  }

  private setTextContentSlidePlacement() {
    if (!this.textCard || !this.textCardParentElement) return;

    if (this.isMobile) {
      this.container?.insertBefore(this.textCard, this.container.firstChild);
    } else {
      this.textCardParentElement.appendChild(this.textCard);
    }

    this.textCardParentElement.hidden = this.isMobile;
    this.swiperInstance?.update();
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.MEDIUM;
    this.setTextContentSlidePlacement();
  }

  private positionSliderControls(): void {
    const slides = this.getElements('[data-slide]');
    const controlsContainer = this.getElement(`[data-controls]`);

    if (!controlsContainer) {
      throw new Error('Slider controls were not found');
    }

    const tallestSlide = slides.reduce((prev, curr) =>
      prev.offsetHeight > curr.offsetHeight ? prev : curr,
    );
    const shortestSlide = slides.reduce((prev, curr) =>
      prev.offsetHeight < curr.offsetHeight ? prev : curr,
    );
    const heightDifference = (tallestSlide.offsetHeight - shortestSlide.offsetHeight) / 2;
    const controlsHeight = controlsContainer.offsetHeight;

    controlsContainer.style.top =
      heightDifference > controlsHeight ? `${heightDifference - controlsHeight / 2}px` : `40px`;
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();
  }

  private get _lightboxData() {
    if (this.lightboxItems.length === 0) {
      return;
    }

    const data = this.lightboxItems.map((item) => {
      const json = item.dataset.lightboxItem;

      if (!json) {
        throw new Error('could not find data for lightbox item');
      }

      return { lightbox: JSON.parse(json) };
    });

    return data;
  }
}
