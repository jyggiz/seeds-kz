import Swiper, { Navigation, Pagination } from 'swiper';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { TweenMax, TweenLite } from 'gsap';
import Draggable from 'gsap/Draggable';

import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import M24Tooltip from 'app/component/molecule/m24-tooltip/M24Tooltip';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import mq from '../../../data/shared-variable/media-queries.json';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import O64HotspotMapTransitionController from './O64HotspotMapTransitionController';
import type { O64HotspotMapItem } from './O64HotspotMap.types';
import { MODAL } from 'app/util/overlayActionTypes';
import { O09ModalCarouselContentProps } from '../o09-modal-carousel-content/O09ModalCarouselContent.types';
import { O64HotspotMapEvent } from './O64HotspotMapEvent';
import { C61HotspotMapItem } from 'app/component/block/c61-hotspot-map/C61HotspotMap.types';
import { isRtl } from 'app/util/rtlUtils';
import { getNavigationPlaceholderComponent } from 'app/util/getNavigationPlaceholderComponent';
import { C00DummyEvent } from 'app/component/block/c00-dummy/C00Dummy.utils';

import './o64-hotspot-map.scss';

const lazyO09Template = () =>
  import(
    '../../organism/o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;

export default class O64HotspotMap extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o64-hotspot-map';

  public readonly transitionController: O64HotspotMapTransitionController;

  private app: App | null = null;
  private isStaticComponent = this.element.classList.contains('-isStatic');
  private hotspots = this.getElements('[data-hotspot]');
  private tooltipWrappers = this.getElements(`[data-tooltip-wrapper]`);
  private tooltips = this.getElements(`[data-component="${M24Tooltip.displayName}"]`);
  private mapImage: HTMLImageElement | null = this.getElement(`[data-image-img]`);
  private hotspotContainer = this.getElement('[data-hotspot-container]');
  private hotspotBackground = this.getElement('[data-hotspot-background]');
  private hotspotBackgroundWrapper = this.getElement('[data-hotspot-background-wrapper]');
  private hotspotData: ReadonlyArray<O64HotspotMapItem> = JSON.parse(
    <string>this.element.dataset.items,
  );
  private draggableInstance: Draggable | null = null;
  private isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.MEDIUM;
  private items: ReadonlyArray<{
    content: any;
    hotspotIndex: number;
    moustacheText: string;
  }>;
  private regionButtons = this.getElements('[data-region-button]');
  private regionDescriptions = this.getElements('[data-region-description]');
  private regionBackgroundImages = this.getElements('.o-hotspotMap__backgroundRegions .a-image');
  private activeRegionIndex = -1;
  private swiperSlider: Swiper | undefined = undefined;
  private chosenRegion: string | null = null;
  private readonly slider = this.getElement('[data-regions-slider]');
  private readonly sliderContainer = this.getElement('[data-regions-slider-container]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly discoverLocationsButton = this.getElement('[data-discover-locations-button]');
  private readonly regionsDescriptionSlider = this.getElement(
    '.o-hotspotMap__regionsDescriptionSlider',
  );
  private readonly imageSizeInterval: number | null = null;
  private readonly IMAGE_SIZE_INTERVAL_DELAY = 2000;
  private readonly xAxisOffset = this.element.dataset.xAxisOffset
    ? Number(this.element.dataset.xAxisOffset)
    : null;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new O64HotspotMapTransitionController(this);

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    if (this.isStaticComponent) {
      this.setStaticHotspots();
    } else {
      this.addEventListeners();
    }

    if (this.mapImage && this.isMobile) {
      this.imageSizeInterval = window.setInterval(() => {
        this.setBackgroundWidthAndHeight();
        this.centerMapPosition();
        this.disposeImageSizeInterval();
      }, this.IMAGE_SIZE_INTERVAL_DELAY);
    }

    if (this.isMobile) {
      this.createDraggableInstance();
    }

    this.tooltips.forEach((tooltip) => tooltip.classList.add(StateClassNames.OPEN));

    this.items = this.hotspotData.flatMap((hotspot, hotspotIndex) => {
      const contentArray = Array.isArray(hotspot.content) ? hotspot.content : [hotspot.content];
      return contentArray.map((content) => ({
        content,
        hotspotIndex,
        moustacheText: hotspot.regionId,
      }));
    });

    if (this.regionDescriptions.length > 0 && this.isMobile) {
      this.initDescriptionsSwiper();
      this.fitDescriptionSwiper();
    }
  }

  private disposeImageSizeInterval(): void {
    if (!this.mapImage || !this.imageSizeInterval) {
      return;
    }

    if (this.mapImage.naturalWidth === 0 || this.mapImage.naturalHeight === 0) {
      return;
    }

    window.clearInterval(this.imageSizeInterval);
  }

  private fitDescriptionSwiper() {
    const sliderContainerHeight = this.slider?.parentElement?.offsetHeight;

    if (!sliderContainerHeight) {
      throw new Error('Cannot get height of slider container');
    }

    this.element.style.marginBottom = `${sliderContainerHeight}px`;
  }

  private initDescriptionsSwiper() {
    if (!this.slider) return;
    Swiper.use([Navigation, Pagination]);

    this.swiperSlider = new Swiper(this.slider, {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 40,
      navigation: {
        nextEl: isRtl() ? this.previousButton : this.nextButton,
        prevEl: isRtl() ? this.nextButton : this.previousButton,
      },
      pagination: {
        bulletClass: 'a-pageIndicators__item',
        bulletElement: 'span',
        bulletActiveClass: StateClassNames.ACTIVE,
        currentClass: StateClassNames.ACTIVE,
        el: this.pagination,
        type: 'bullets',
      },
      on: {
        slideChange: (swiper) => {
          if (this.activeRegionIndex !== -1) {
            this.regionButtons[swiper.realIndex].click();
          }
        },
      },
    });
  }

  private setStaticHotspots(): void {
    this.hotspots.forEach((hotspot, index) => {
      const activeHotspot = hotspot.classList.contains(StateClassNames.ACTIVE);
      if (activeHotspot) {
        hotspot.classList.add(StateClassNames.ACTIVE);
        this.tooltipWrappers[index].classList.add(StateClassNames.OPEN);
      }
    });
  }

  private addEventListeners(): void {
    this.hotspots.forEach((hotspot, index) => {
      this.addDisposableEventListener(hotspot, 'mouseenter', () => {
        this.setHotspotState(hotspot, index);
      });

      this.addDisposableEventListener(hotspot, 'mouseleave', () => {
        if (!this.hotspotContainer?.classList.contains(StateClassNames.DISABLED)) {
          this.hotspots[index].classList.remove(StateClassNames.ACTIVE);
          this.tooltipWrappers[index].classList.remove(StateClassNames.OPEN);
        }
      });

      this.addDisposableEventListener(hotspot, 'click', (event) => {
        event.stopPropagation();
        this.onHotSpotClick(index);
        this.hotspotContainer?.classList.add(StateClassNames.DISABLED);
        this.setHotspotState(hotspot, index);
      });
    });

    this.hotspotContainer &&
      this.addDisposableEventListener(this.hotspotContainer, 'mouseenter', () => {
        this.tooltipWrappers.forEach((tooltip) => {
          tooltip.classList.remove(StateClassNames.OPEN);
        });
        this.hotspots.forEach((hotspot) => {
          hotspot.classList.remove(StateClassNames.ACTIVE);
        });
        this.hotspotContainer?.classList.remove(StateClassNames.DISABLED);
      });

    this.addDisposableEventListener<O64HotspotMapEvent>(
      this.dispatcher,
      O64HotspotMapEvent.UPDATE_MAP,
      this.updateMap.bind(this),
    );

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    this.regionButtons.forEach((button, index) => {
      this.addDisposableEventListener(button, 'mouseenter', () => {
        this.toggleRegionHotpots(button, index);
      });

      if (this.isMobile) {
        this.addDisposableEventListener(button, 'click', () => {
          this.showMobileRegionDescription(button, index);
        });
      }
    });

    if (this.discoverLocationsButton) {
      this.addDisposableEventListener(this.discoverLocationsButton, 'click', () => {
        const index = this.items.findIndex((item) => item.moustacheText === this.chosenRegion);
        this.openCarousel(index === -1 ? 0 : index);
      });
    }
  }

  private showMobileRegionDescription(button: HTMLElement, index: number) {
    if (this.activeRegionIndex === -1 && this.regionsDescriptionSlider) {
      TweenMax.to(this.regionsDescriptionSlider, 0.5, {
        y: 0,
      });

      if (this.discoverLocationsButton) {
        TweenMax.to(this.discoverLocationsButton, 0.5, {
          y: `-${this.regionsDescriptionSlider.clientHeight}px`,
        });
      }
    }
    this.swiperSlider?.slideTo(index);
    this.toggleRegionHotpots(button, index);
  }

  private toggleRegionHotpots(button: HTMLElement, index: number) {
    if (this.activeRegionIndex !== -1) {
      this.regionBackgroundImages[this.activeRegionIndex].style.opacity = '0';
      this.regionDescriptions[this.activeRegionIndex].style.opacity = '0';
    }

    this.regionDescriptions[index].style.opacity = '1';
    this.regionBackgroundImages[index].style.opacity = '1';

    this.activeRegionIndex = index;

    this.hotspots.forEach((hotspot) => {
      this.chosenRegion = button.dataset.regionButton || null;
      if (!hotspot.dataset.item || !this.chosenRegion) return;
      const hotspotData = JSON.parse(hotspot.dataset.item) as C61HotspotMapItem;

      hotspot.classList.toggle(StateClassNames.HIDDEN, hotspotData.regionId !== this.chosenRegion);
    });
  }

  public async adopted() {
    if (!window.location.href.includes('viewMode=story')) {
      this.app = await getAppComponent();

      this.addDisposableEventListener(
        this.app.element,
        'overlayAction',
        this.onOverlayAction.bind(this),
      );

      const navigationDummyComponent = getNavigationPlaceholderComponent();

      if (navigationDummyComponent) {
        const verticalPadding = 0.16 * window.innerHeight;

        this.addDisposableEventListener<C00DummyEvent>(
          navigationDummyComponent.dispatcher,
          C00DummyEvent.types.NAVIGATION_HEIGHT,
          (event) => {
            this.element.style.setProperty(
              '--hotspot-map-height',
              `calc(100vh - ${event.height}px - ${verticalPadding}px)`,
            );
          },
        );
      } else {
        this.element.style.setProperty('--hotspot-map-height', `65vh`);
      }
    }
  }

  private onOverlayAction(event: Event): void {
    const type = (event as unknown as CustomEvent).detail.type;
    if (type === MODAL.CLOSE) {
      if (this.regionDescriptions.length > 0 && !this.isMobile) {
        const element = this.regionDescriptions[this.activeRegionIndex];
        if (element?.dataset) {
          const { positionX, positionY } = element.dataset;
          TweenMax.to(element, 0.5, {
            left: positionX,
            top: positionY,
          });
        }
      }
    }
  }

  private setBackgroundWidthAndHeight() {
    const imageWidth = this.mapImage?.naturalWidth;
    const imageHeight = this.mapImage?.naturalHeight;

    if (this.hotspotBackground) {
      this.hotspotBackground.style.width = `${imageWidth}px`;
      this.hotspotBackground.style.height = `${imageHeight}px`;
    }
  }

  private createDraggableInstance(): void {
    if (!this.hotspotBackgroundWrapper || !this.hotspotBackground || this.draggableInstance) {
      return;
    }

    this.draggableInstance = Draggable.create(this.hotspotBackground, {
      bounds: this.hotspotBackgroundWrapper,
      zIndexBoost: false,
    });
  }

  private centerMapPosition(): void {
    if (!this.hotspotBackground) {
      return;
    }

    if (
      isNaN(parseInt(this.hotspotBackground.style.width)) ||
      !this.hotspotBackground.style.width.includes('px')
    ) {
      return;
    }

    if (
      isNaN(parseInt(this.hotspotBackground.style.height)) ||
      !this.hotspotBackground.style.height.includes('px')
    ) {
      return;
    }

    const width = parseInt(this.hotspotBackground.style.width);
    const height = parseInt(this.hotspotBackground.style.height);
    const rtlModifier = isRtl() ? -1 : 1;
    const totalHeight =
      height / 2 - window.innerHeight / 2 > 0 ? -1 * (height / 2 - window.innerHeight / 2) : 0;

    if (this.hotspotBackground) {
      if (this.xAxisOffset) {
        TweenMax.set(this.hotspotBackground, { x: `-${this.xAxisOffset}%`, y: `0%` });
      } else {
        TweenMax.set(this.hotspotBackground, {
          transform: `translate3d(${
            rtlModifier * -1 * (width / 2 - window.innerWidth / 2)
          }px, ${totalHeight}px, 0px)`,
        });
      }
    }
  }

  public onHotSpotClick(index: number) {
    if (this.regionDescriptions.length > 0 && !this.isMobile && this.activeRegionIndex !== -1) {
      TweenMax.to(this.regionDescriptions[this.activeRegionIndex], 0.5, {
        left: '5%',
        top: '5%',
      });
    }
    this.openCarousel(index);
  }

  public async openCarousel(index: number) {
    const hotspotContent = this.hotspotData[index].content;
    const activeItemContent = Array.isArray(hotspotContent) ? hotspotContent[0] : hotspotContent;

    const data = {
      activeItemIndex: this.items.findIndex((item) => item.content === activeItemContent),
      variant: 'fullBleedCarousel',
      highlightHotspots: true,
      items: this.items,
    };

    const [o09Template, overlay] = await Promise.all([lazyO09Template(), this.app?.overlay]);

    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: o09Template.default,
        data,
        options: {
          classnames: ['-fullBleedCarousel'],
        },
      },
    });
  }

  private setHotspotState(hotspot: HTMLElement, index: number): void {
    this.tooltipWrappers.forEach((tooltip, tooltipIndex) => {
      if (tooltipIndex !== index) {
        this.hotspots[tooltipIndex].classList.remove(StateClassNames.ACTIVE);
        tooltip.classList.remove(StateClassNames.OPEN);
      } else {
        hotspot.classList.add(StateClassNames.ACTIVE);
        tooltip.classList.add(StateClassNames.OPEN);
        this.setTooltipLocation(hotspot, tooltip);
      }
    });
  }

  private setTooltipLocation(hotspot: HTMLElement, tooltip: HTMLElement): void {
    if (!this.hotspotContainer) throw new Error('The Hotstpot container element is not found');
    const windowWidth = window.innerWidth;
    const hotspotOffsetRight =
      windowWidth - hotspot.getBoundingClientRect().x - hotspot.offsetWidth / 2;
    const isHotspotFarLeft = hotspot.getBoundingClientRect().x < tooltip.offsetWidth / 2;
    const isHotspotFarRight = hotspotOffsetRight && hotspotOffsetRight < tooltip.offsetWidth / 2;
    const isHotspotFarTop =
      tooltip.getBoundingClientRect().y < this.hotspotContainer.getBoundingClientRect().y;

    if (isHotspotFarTop) {
      tooltip.classList.add(StateClassNames.TOP);
    }

    if (isHotspotFarLeft) {
      tooltip.classList.add(StateClassNames.LEFT);
      const offsetLeft = hotspot.getBoundingClientRect().x - tooltip.offsetWidth / 2;
      this.moveHotspotBackgroundX(offsetLeft);
    }

    if (isHotspotFarRight && hotspotOffsetRight) {
      tooltip.classList.add(StateClassNames.RIGHT);
      this.moveHotspotBackgroundX(hotspotOffsetRight);
    }
  }

  private moveHotspotBackgroundX(offset: number) {
    if (this.hotspotBackground) {
      const transform = this.hotspotBackground.style.transform;
      const re = /translate3d\((?<x>.*?)px, (?<y>.*?)px, (?<z>.*?)px/;
      const results = re.exec(transform);

      if (results) {
        const x = results[1];
        const y = results[2];
        const z = results[3];
        const newTranslate3dX = Number(x) - offset;
        this.hotspotBackground.style.transform = `translate(-19%, -30%) translate3d(${newTranslate3dX}px, ${y}px, ${z}px)`;
      }
    }
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    if (state < mq.deviceState.MEDIUM) {
      this.setBackgroundWidthAndHeight();
      this.createDraggableInstance();
      this.centerMapPosition();
      this.hotspots.forEach((hotspot) => {
        const { offset } = JSON.parse(<string>hotspot.dataset.item);
        this.setHotspotsOffset(hotspot, offset);
      });
    } else {
      if (this.draggableInstance) {
        this.draggableInstance[0].kill();
        TweenLite.set(this.hotspotBackground, { clearProps: 'x,y' });
      }
      if (this.hotspotBackground) {
        this.hotspotBackground.style.width = `100%`;
        this.hotspotBackground.style.height = `100%`;
      }
      this.hotspots.forEach((hotspot) => {
        const { offset } = JSON.parse(<string>hotspot.dataset.item);
        this.setHotspotsOffset(hotspot, offset);
      });
    }
  }

  private setHotspotsOffset(hotspot: HTMLElement, offset: any): void {
    hotspot.style.top = `${offset.y}%`;
    hotspot.style.left = `${offset.x}%`;
  }

  private updateMap(event: O64HotspotMapEvent): void {
    const visibleHotspots = event.hotspots;

    this.hotspots.forEach((currentHotspot) => {
      currentHotspot.classList.toggle(
        StateClassNames.HIDDEN,
        !visibleHotspots.includes(currentHotspot),
      );
    });
  }

  public hideContent(): void {
    this.hotspots.forEach((hotspot) => {
      hotspot.classList.add(StateClassNames.HIDDEN);
      hotspot.classList.remove(StateClassNames.ACTIVE);
    });

    this.regionButtons.forEach((regionButton) => {
      regionButton.classList.add(StateClassNames.HIDDEN);
    });

    this.discoverLocationsButton?.classList.add(StateClassNames.HIDDEN);
    this.tooltips.forEach((tooltip) => tooltip.classList.remove(StateClassNames.OPEN));
    this.sliderContainer?.classList.add(StateClassNames.DISABLED);
  }

  public showContent(): void {
    this.hotspots.forEach((hotspot) => {
      hotspot.classList.remove(StateClassNames.HIDDEN);
    });

    this.regionButtons.forEach((regionButton) => {
      regionButton.classList.remove(StateClassNames.HIDDEN);
    });

    this.discoverLocationsButton?.classList.add(StateClassNames.HIDDEN);
    this.tooltips.forEach((tooltip) => tooltip.classList.add(StateClassNames.OPEN));
    this.sliderContainer?.classList.remove(StateClassNames.DISABLED);
  }

  public dispose() {
    if (this.imageSizeInterval) {
      window.clearInterval(this.imageSizeInterval);
    }
  }
}
