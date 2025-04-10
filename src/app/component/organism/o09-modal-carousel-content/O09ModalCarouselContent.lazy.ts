import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O09ModalCarouselContentTransitionController from './O09ModalCarouselContentTransitionController';
import Swiper, { Navigation, Pagination } from 'swiper';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { SliderOptions } from './O09ModalCarouselContent.types';
import { C61HotspotMapItem } from 'app/component/block/c61-hotspot-map/C61HotspotMap.types';
import O64HotspotMap from '../o64-hotspot-map/O64HotspotMap.lazy';
import O10Modal from 'app/component/organism/o10-modal/O10Modal.lazyOverlay';
import { getAppComponent } from 'app/util/getElementComponent';
import { getComponentForElement } from 'muban-core';
import { O09ModalCarouselContentProps } from './O09ModalCarouselContent.types';
import A02Icon, { svgContext } from 'app/component/atom/a02-icon/A02Icon';
import debounce from 'lodash-es/debounce';
import O67ModalListViewer from 'app/component/organism/o67-modal-list-viewer/O67ModalListViewer.lazy';
import C61HotspotMap from 'app/component/block/c61-hotspot-map/C61HotspotMap.lazy';
import { TimelineLite } from 'gsap';
import '../../../vendor/gsap/DrawSVGPlugin';
import M24Tooltip from '../../molecule/m24-tooltip/M24Tooltip';
import M26HotspotButton from 'app/component/molecule/m26-hotspot-button/M26HotspotButton';
import { isRtl } from '../../../util/rtlUtils';
import S09Overlay from 'app/component/block/s09-overlay/S09Overlay.lazyOverlay';
import App from 'app/component/layout/app/App';
import { MODAL } from 'app/util/overlayActionTypes';

import './o09-modal-carousel-content.scss';

type HotspotInMap = HTMLElement;
type HotspotInPath = HTMLElement | undefined;

const isHotspotInMap = (hotspot: HotspotInPath): hotspot is HotspotInMap => !!hotspot;
export default class O09ModalCarouselContent extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o09-modal-carousel-content';

  public readonly transitionController: O09ModalCarouselContentTransitionController;

  private readonly slider = this.getElement('[data-slider]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly sliderItems = this.getElements('[data-slider-item]');
  private readonly sliderItem = this.sliderItems[0];
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly hotspots = document && document.querySelectorAll<HTMLElement>('[data-hotspot]');
  private readonly hotspotMap =
    document &&
    document.querySelector<HTMLElement>(`[data-component="${O64HotspotMap.displayName}"]`);
  private readonly hotspotMapContainer =
    this.hotspotMap && this.hotspotMap.querySelector<HTMLElement>('[data-hotspot-container]');
  private readonly props: O09ModalCarouselContentProps =
    this.element.dataset.props && JSON.parse(this.element.dataset.props);
  private svgCanvas: SVGSVGElement | null = null;
  private modal: O10Modal | null = null;
  private mask: HTMLElement | null = null;
  private localMask: HTMLElement | null = null;
  private itinerariesViewer: HTMLElement | null = null;
  private C61HotspotMapNode: HTMLElement | null = null;
  private readonly NUMERIC_REGEXP = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;
  private enableItineraryHighlighting: boolean = true;
  private overlay: HTMLElement | null = null;
  private swiperSlider: Swiper | undefined = undefined;
  private currentDeviceState: IDeviceStateData['state'];
  private highlightItineraries: null | HTMLElement = this.getElement('[data-highlight-itinerary]');
  private highlightHotspots: null | HTMLElement = this.getElement('[data-highlight-hotspots]');
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O09ModalCarouselContentTransitionController(this);

    this.currentDeviceState = deviceStateTracker.currentDeviceState.state;

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  public async adopted(): Promise<void> {
    this.app = await getAppComponent();

    const modal = this.app.getElement(`[data-component="${O10Modal.displayName}"]`);
    this.overlay = this.app.getElement(`[data-component='${S09Overlay.displayName}']`);

    if (modal) {
      this.modal = getComponentForElement<O10Modal>(modal);
    }
    const itinerariesViewer = this.app.getElement(
      `[data-component="${O67ModalListViewer.displayName}"]`,
    );
    if (itinerariesViewer) {
      this.itinerariesViewer = itinerariesViewer;
    }
    const C61HotspotMapNode = this.app.getElement(
      `[data-component="${C61HotspotMap.displayName}"]`,
    );
    if (C61HotspotMapNode) {
      this.C61HotspotMapNode = C61HotspotMapNode;
    }

    this.initSlider({
      highlightHotspots: Boolean(this.highlightHotspots),
      hightlightItinerary: Boolean(this.highlightItineraries),
    });

    // reassign listeners to 'previous modal buttons' since
    // swiper instance creates dupliacate slides for which
    // the previous modal buttons would not have an assigned listener
    this.modal?.assignPreviousModalButtons();
  }

  private dispatchSlideChangeAction = async (currentIndex: number) => {
    const overlay = await this.app?.overlay;
    await overlay?.dispatchAction({ type: MODAL.SLIDE_CHANGE }, { currentIndex });
  };

  public async initSlider(sliderOptions?: SliderOptions): Promise<void> {
    this.destroySlider();

    const activeItemIndex = this.props && this.props.activeItemIndex;

    if (this.slider) {
      Swiper.use([Navigation, Pagination]);

      this.swiperSlider = new Swiper(this.slider, {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        spaceBetween: 40,
        navigation: {
          nextEl: isRtl() ? this.previousButton : this.nextButton,
          prevEl: isRtl() ? this.nextButton : this.previousButton,
        },
        on: {
          slideChange: () => {
            /*
              Workaround fix for swiper loop issue https://github.com/nolimits4web/swiper/issues/2629
            */
            const headingIcons = this.getElements<HTMLElement>(
              '.swiper-slide-duplicate .o-modalCarouselContent__heading .a-icon',
            );

            headingIcons.forEach(async (iconElement) => {
              if (iconElement.dataset?.icon) {
                iconElement.innerHTML = await svgContext(`./${iconElement.dataset.icon}.svg`);
              }
            });
          },
          slideChangeTransitionStart: (swiper) => {
            this.dispatchSlideChangeAction(swiper.realIndex);
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
        breakpoints: {
          768: {
            spaceBetween: this.sliderItem.offsetWidth,
          },
        },
        noSwipingClass: 'o-modalCarouselContent__previousModalButton',
        initialSlide: activeItemIndex,
      });

      this.addSlideChangeListener(sliderOptions);

      if (sliderOptions?.hightlightItinerary && this.enableItineraryHighlighting) {
        this.addDisposableEventListener(
          window,
          'resize',
          debounce(() => this.highlightItinerary(), 500, { trailing: true }),
        );
      }

      sliderOptions?.highlightHotspots && this.highlightHotspot();
      sliderOptions?.hightlightItinerary && this.highlightItinerary();
    }
  }

  private drawSvgCanvas() {
    if (!this.hotspotMapContainer) {
      throw new Error('No map container found.');
    }

    const svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.hotspotMapContainer.prepend(svgCanvas);
    const mapHeight = this.hotspotMapContainer.clientHeight;
    const mapWidth = this.hotspotMapContainer.clientWidth;
    svgCanvas.setAttribute('height', `${mapHeight}`);
    svgCanvas.setAttribute('width', `${mapWidth}`);
    svgCanvas.classList.add('o-hotspotMap__svgCanvas');

    return svgCanvas;
  }

  private addSlideChangeListener(sliderOptions?: SliderOptions) {
    if (sliderOptions?.highlightHotspots) {
      this.swiperSlider && this.swiperSlider.on('slideChange', () => this.highlightHotspot());
    }
    if (sliderOptions?.hightlightItinerary) {
      this.swiperSlider && this.swiperSlider.on('slideChange', () => this.highlightItinerary());
    }
  }

  private highlightHotspot() {
    const isHotpotIndex = !!this.sliderItems[0].dataset.hotspotIndex;
    const hotspotIndex = isHotpotIndex
      ? Number(this.sliderItems[this.swiperSlider?.realIndex ?? 0].dataset.hotspotIndex)
      : this.swiperSlider?.realIndex ?? 0;
    this.hotspots &&
      this.hotspots.forEach((element, index) => {
        const currentTooltip = isHotpotIndex
          ? this.getElement('[data-tooltip-wrapper]', element)
          : this.getElement(`[data-component=${M24Tooltip.displayName}`, element);

        if (this.swiperSlider) {
          if (index !== hotspotIndex) {
            element.classList.remove(StateClassNames.ACTIVE);
            currentTooltip?.classList.remove(StateClassNames.OPEN);
          } else {
            element.classList.add(StateClassNames.ACTIVE);
            currentTooltip?.classList.add(StateClassNames.OPEN);
          }
        }
      });
  }

  private async highlightItinerary() {
    if (!this.enableItineraryHighlighting) {
      return;
    }
    if (
      !this.props ||
      !this.hotspots ||
      !this.swiperSlider ||
      !this.hotspotMap ||
      !this.hotspotMapContainer
    ) {
      throw new Error('Could not get one the params needed to highlight itinerary.');
    }

    const activeIndex = this.swiperSlider.realIndex;

    const pathToDraw: number[] | undefined =
      this.props && this.props.items[activeIndex].content?.path;

    if (!pathToDraw) {
      this.revertItineraryStyling();
      return;
    }

    const hotspotsInPath: HotspotInPath[] = pathToDraw.map(
      (hotspotIndex: number) => this.hotspots[hotspotIndex - 1],
    );

    const mapHotspotsInPath = hotspotsInPath.filter(isHotspotInMap);

    if (!mapHotspotsInPath.length) {
      this.revertItineraryStyling();
      return;
    }

    if (!this.svgCanvas) {
      this.svgCanvas = this.drawSvgCanvas();
    }
    while (this.svgCanvas.firstChild) {
      this.svgCanvas.removeChild(this.svgCanvas.firstChild);
    }
    this.restoreHotspotStyling();

    const offsetsToConnect: Array<C61HotspotMapItem['offset']> = pathToDraw
      .map(
        (hotspotIndex: number) =>
          this.hotspots[hotspotIndex - 1] &&
          this.hotspots[hotspotIndex - 1].dataset.item &&
          JSON.parse(this.hotspots[hotspotIndex - 1].dataset.item!).offset,
      )
      .filter((offset) => !!offset);

    hotspotsInPath.forEach((hotspot, index) => {
      if (!hotspot) {
        return;
      }
      hotspot.classList.add('-isPartOfItinerary');
      const svgCross = hotspot.querySelector<HTMLElement>(
        `[data-component='${A02Icon.displayName}']`,
      );
      if (svgCross) {
        svgCross.style.display = 'none';
      }
      const button = hotspot.querySelector<HTMLElement>(
        `[data-component='${M26HotspotButton.displayName}']`,
      );
      const stopIndex = document.createElement('span');
      stopIndex.classList.add('m-hotspotButton__stopIndex');
      stopIndex.innerText = (index + 1).toString();
      button?.appendChild(stopIndex);
    });

    const pathLines = this.createSvgPaths(offsetsToConnect);

    this.animatePath(mapHotspotsInPath, pathLines);

    this.createLocalMask();

    this.bringHiddenHotspotsIntoView(mapHotspotsInPath);
  }

  private createSvgPaths(offsetCoords: Array<{ x: number; y: number }>) {
    if (!this.hotspotMapContainer || !this.svgCanvas) {
      throw new Error(
        'Could not get map container dimensions or svg canvas to calculate the itinerary paths',
      );
    }
    const mapHeight = this.hotspotMapContainer.clientHeight;
    const mapWidth = this.hotspotMapContainer.clientWidth;

    const pathLines: SVGPathElement[] = [];

    offsetCoords.forEach((offset, index) => {
      if (index !== offsetCoords.length - 1) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.id = `line${index}`;
        line.setAttribute('stroke', '#fff');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '8');

        const lineStartPosition = offset;
        const lineEndPosition = offsetCoords[index + 1];

        const x1 = (lineStartPosition.x / 100) * mapWidth;
        const y1 = (lineStartPosition.y / 100) * mapHeight;
        const x2 = (lineEndPosition.x / 100) * mapWidth;
        const y2 = (lineEndPosition.y / 100) * mapHeight;

        line.setAttribute('d', `M${x1} ${y1} ${x2} ${y2}`);
        line.setAttribute(`mask`, `url(#mask${index})`);

        const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
        mask.id = `mask${index}`;
        mask.setAttribute('maskUnits', 'userSpaceOnUse');

        const maskedLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        maskedLine.setAttribute('d', `M${x1} ${y1} ${x2} ${y2}`);
        maskedLine.setAttribute('stroke', '#fff');
        maskedLine.setAttribute('stroke-width', '2');

        mask.appendChild(maskedLine);
        this.svgCanvas!.appendChild(line);
        this.svgCanvas!.appendChild(mask);
        pathLines.push(maskedLine);
      }
    });

    return pathLines;
  }

  private bringHiddenHotspotsIntoView(hotspots: HTMLElement[]) {
    const modalPanelWidth = this.modal?.getElement('[data-panel]')?.clientWidth;

    if (!modalPanelWidth || !this.C61HotspotMapNode || !this.itinerariesViewer) {
      throw new Error('Cannot get all parameters necessary to bring hidden hotspots into view');
    }

    const existingTransformXValue = this.C61HotspotMapNode.style.transform.match(
      this.NUMERIC_REGEXP,
    );

    const availableWidth =
      window.innerWidth -
      modalPanelWidth +
      (existingTransformXValue ? Number(existingTransformXValue[0]) : 0);

    const boundingRects = hotspots.map((hotspot) => hotspot.getBoundingClientRect().right);

    const hotspotFurthestFromLeftWindowBorder = Math.max(...boundingRects);

    if (availableWidth < hotspotFurthestFromLeftWindowBorder) {
      const amountToPixelsToMoveMap = hotspotFurthestFromLeftWindowBorder - availableWidth;
      if (this.C61HotspotMapNode) {
        this.C61HotspotMapNode.style.transform = `translateX(-${amountToPixelsToMoveMap + 20}px)`;
      }

      if (this.itinerariesViewer) {
        this.itinerariesViewer.style.transform = `translateX(${amountToPixelsToMoveMap + 20}px)`;
      }
    } else {
      this.C61HotspotMapNode.style.transform = 'translateX(0)';
      this.itinerariesViewer.style.transform = `translateX(0)`;
    }
  }

  private animatePath(hotspots: HTMLElement[], pathLines: SVGPathElement[]) {
    const tl = new TimelineLite();

    hotspots.forEach((hotspot, index) => {
      const interval = 0.3;

      tl.from(hotspot, interval, { opacity: 0 });
      if (index !== hotspots.length - 1) {
        tl.fromTo(
          pathLines[index],
          interval,
          { drawSVG: '0%' },
          { drawSVG: '100%', ease: 'Power2.easOut' },
        );
      }
    });
  }

  private createLocalMask() {
    if (this.modal) {
      this.mask = !this.mask
        ? this.getElement('[data-mask]', this.overlay ?? undefined)
        : this.mask;

      if (this.mask) {
        this.mask.style.display = 'none';
      }

      if (!this.localMask) {
        this.localMask = document.createElement('div');
        this.localMask.classList.add('o-hotspotMap__mask');
        this.hotspotMapContainer && this.hotspotMapContainer.prepend(this.localMask);
      }
    }
  }

  private destroySlider() {
    if (this.swiperSlider) {
      this.swiperSlider.destroy();
    }
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    if (
      (state < mq.deviceState.MEDIUM && this.currentDeviceState >= mq.deviceState.MEDIUM) ||
      (state >= mq.deviceState.MEDIUM && this.currentDeviceState < mq.deviceState.MEDIUM)
    ) {
      this.initSlider();
    }
    if (state < mq.deviceState.XLARGE) {
      this.enableItineraryHighlighting && this.revertItineraryStyling();
      this.enableItineraryHighlighting = false;
    } else {
      this.enableItineraryHighlighting = true;
    }

    this.currentDeviceState = state;
  }

  private restoreHotspotStyling() {
    this.hotspots.forEach((hotspot) => {
      const svgCross = hotspot.querySelector<HTMLElement>(
        `[data-component='${A02Icon.displayName}']`,
      );
      if (svgCross) {
        svgCross.style.display = 'block';
      }
      hotspot.classList.remove('-isPartOfItinerary');
      const stopIndex = hotspot.querySelector<HTMLElement>('.m-hotspotButton__stopIndex');

      if (stopIndex && stopIndex.parentNode) {
        stopIndex.parentNode.removeChild(stopIndex);
      }
    });
  }

  private revertItineraryStyling() {
    this.restoreHotspotStyling();
    if (this.mask) {
      this.mask.style.display = 'block';
    }

    if (this.C61HotspotMapNode) {
      this.C61HotspotMapNode.style.removeProperty('transform');
    }

    if (
      this.itinerariesViewer &&
      deviceStateTracker.currentDeviceState.state > mq.deviceState.SMALL
    ) {
      this.itinerariesViewer.style.removeProperty('transform');
    }

    if (this.hotspotMapContainer) {
      this.localMask && this.hotspotMapContainer.removeChild(this.localMask);
      this.localMask = null;
      this.svgCanvas && this.hotspotMapContainer.removeChild(this.svgCanvas);
      this.svgCanvas = null;
    }
  }

  public dispose() {
    super.dispose();
    this.disposables.dispose();
    this.destroySlider();
    this.enableItineraryHighlighting && this.revertItineraryStyling();
  }
}
