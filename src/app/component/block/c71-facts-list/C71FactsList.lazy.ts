import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import App from 'app/component/layout/app/App';
import { getAppComponent } from 'app/util/getElementComponent';
import C71FactsListTransitionController from './C71FactsListTransitionController';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import Swiper, { Pagination } from 'swiper';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { O09ModalCarouselContentProps } from '../../organism/o09-modal-carousel-content/O09ModalCarouselContent.types';
import { MODAL } from '../../../util/overlayActionTypes';
import { C71ModalContent } from './C71FactsList.types';
import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';

import './c71-facts-list.scss';
import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';

const lazyO09Template = () =>
  import(
    '../../organism/o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;

export default class C71FactsList extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c71-facts-list';

  public readonly transitionController: C71FactsListTransitionController;
  private app: App | null = null;

  private slider = this.getElement('[data-slider]');
  private pagination = this.getElement('[data-slider-pagination]');

  private items = this.getElements('[data-item]');
  private images = this.getElements(`[data-image-img`);
  private modalContent: Array<C71ModalContent> = this.items.map((item) =>
    JSON.parse(item.dataset.modal || '{}'),
  );
  private headingText: string | undefined =
    this.element.dataset.heading && JSON.parse(this.element.dataset.heading);
  private eyebrowProps: A04EyebrowProps | undefined =
    this.element.dataset.eyebrow && JSON.parse(this.element.dataset.eyebrow);
  private contentVariant = this.element.dataset.variant;
  private swiperSlider: Swiper | undefined = undefined;
  private isSliderDestroyed: boolean = false;
  private isSliderInitiated: boolean = false;
  private isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.LARGE_LANDSCAPE;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C71FactsListTransitionController(this);
    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addEventListeners();
    //console.log(this.modalContent);
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();

    this.addDisposableEventListener(this.app?.element, 'overlayAction', (event) => {
      const customEvent = event as unknown as CustomEvent;
      const { type, params } = customEvent.detail;

      if (type === MODAL.SLIDE_CHANGE && params && !isNaN(params.currentIndex)) {
        this.setActiveListItem(params.currentIndex);
      }
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
        breakpoints: {
          768: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
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

  private transformImage(index: number): void {
    if (deviceStateTracker.currentDeviceState.state <= mq.deviceState.MEDIUM) return;
    this.transitionController.scaleImage(this.images[index], 0.5);
  }

  private setActiveListItem(activeIndex: number) {
    this.items.forEach((listItem, listItemindex) => {
      if (activeIndex === listItemindex) {
        if (!listItem.classList.contains(StateClassNames.ACTIVE)) {
          this.transformImage(activeIndex);
        }
        listItem.classList.add(StateClassNames.ACTIVE);
      } else {
        listItem.classList.remove(StateClassNames.ACTIVE);
      }
    });
  }

  private addEventListeners(): void {
    this.items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        this.setActiveListItem(index);
      });
    });

    this.items.forEach((item, index) => {
      const itemTitle = this.getElement('[data-title]', item);
      const isButton = itemTitle?.tagName.toLowerCase() === 'button';

      if (this.hasModalContent(this.modalContent[index]) && isButton) {
        this.addDisposableEventListener(itemTitle, 'click', () => {
          !this.isMobile && this.openCarousel(index);
        });

        this.addDisposableEventListener(itemTitle, 'focus', () => {
          this.setActiveListItem(index);
        });
      }
    });

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );
  }

  public async openCarousel(index: number) {
    const data = {
      activeItemIndex: index,
      variant: 'textContentCarousel',
      items: this.modalContent.map((content) => ({ content })),
      eyebrow: this.eyebrowProps,
      title: this.headingText,
    };

    const [o09Template, overlay] = await Promise.all([lazyO09Template(), this.app?.overlay]);

    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: o09Template.default,
        data,
        options: {
          classnames: ['-textContentCarousel', `-${this.contentVariant}`],
        },
      },
    });
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.LARGE_LANDSCAPE;

    if (this.slider) {
      if (this.isMobile) {
        this.initSlider();
      } else {
        this.destroySlider();
      }
    }
  }

  private hasModalContent(modalContentItem: C71ModalContent): boolean {
    return 'heading' in modalContentItem && 'copy' in modalContentItem;
  }
}
