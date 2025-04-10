import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C114InfographicTransitionController from './C114InfographicTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import Swiper, { Navigation, Pagination } from 'swiper';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { LIGHTBOX } from 'app/util/overlayActionTypes';
import O39LightboxContentProps from '../../organism/o39-lightbox-content/O39LightboxContent.types';
import { O32GalleryCardProps } from '../../organism/o32-gallery-card/O32GalleryCard.types';
import M02Button from 'app/component/molecule/m02-button/M02Button';
import { toggleControlsVisibility } from '../../../util/swiper/toggleControlsVisibility';
import trackSliderItemsVisibility from 'app/util/trackSliderItemsVisibility';

import './c114-infographic.scss';

const lazyO39Template = () =>
  import(
    '../../organism/o39-lightbox-content/o39-lightbox-content.hbs?include'
  ) as LoadTemplateImport<O39LightboxContentProps>;

export default class C114Infographic extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c114-infographic';

  private readonly slider = this.getElement('[data-slider]');
  private readonly previousButton = this.getElement('[data-previous-button]');
  private readonly nextButton = this.getElement('[data-next-button]');
  private readonly controls = this.getElement('[data-controls]');
  private pagination = this.getElement('[data-slider-pagination]');
  private readonly galleryList = this.getElement('[data-gallery-list]');
  private readonly slides = this.getElements('[data-gallery-list-item]');
  private readonly fullScreenButtons = this.getElements(
    `[data-gallery-list-item] [data-fullscreen-button] [data-component=${M02Button.displayName}]`,
  );
  private app: App | null = null;

  private swiperTimeout: number | null = null;

  private readonly lightboxItems: Array<Omit<O32GalleryCardProps, 'video' | 'preview'>> = [];

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new C114InfographicTransitionController(this);

    this.initSlider();
    this.addEventListeners();
    toggleControlsVisibility(this.controls, this.previousButton, this.nextButton);

    try {
      this.lightboxItems =
        this.galleryList?.dataset.lightbox && JSON.parse(<string>this.galleryList.dataset.lightbox);
    } catch (error) {
      console.error(error);
    }
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();
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
      titleSelectorName: '.o-galleryCard__copy',
    });
  }

  private addEventListeners(): void {
    this.fullScreenButtons.forEach((button, index) => {
      this.addDisposableEventListener(button, 'click', () => this.openLightbox(index));
    });

    this.addDisposableEventListener(window, 'resize', () =>
      toggleControlsVisibility(this.controls, this.previousButton, this.nextButton),
    );
  }

  private async openLightbox(index: number): Promise<void> {
    if (this.app === null) throw new Error('App was not found');
    if (!this.galleryList) throw new Error('Gallery list was not found');

    if (this.lightboxItems.length > 0) {
      const content = {
        items: this.lightboxItems,
      };

      const data = {
        content,
        index,
        mobilePreview: {
          icon: { name: 'rotated-phone' },
          copy: this.element.dataset.mobilePreviewCopy,
        },
        isExtended: true,
      };

      const [template, overlay] = await Promise.all([lazyO39Template(), this.app.overlay]);

      await overlay.dispatchAction({
        type: LIGHTBOX.STANDARD_DYNAMIC,
        payload: {
          template: template.default,
          data,
          options: {
            classnames: ['-fullScreen', '-isExtended'],
          },
        },
      });
    }
  }

  private initSlider(): void {
    Swiper.use([Navigation, Pagination]);
    if (this.slider) {
      const swiper = new Swiper(this.slider, {
        loop: false,
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 30,
        watchSlidesVisibility: true,
        slideVisibleClass: StateClassNames.VISIBLE,
        grabCursor: true,
        navigation: {
          disabledClass: StateClassNames.DISABLED,
          nextEl: this.nextButton,
          prevEl: this.previousButton,
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
          slideChange: () => {
            this.trackVisibleSlides();
          },
        },
        breakpoints: {
          1024: {
            spaceBetween: 70,
            freeMode: true,
            freeModeMinimumVelocity: 0.02,
            threshold: 5,
          },
        },
      });
    }
  }

  public dispose() {
    super.dispose();

    if (this.swiperTimeout) {
      clearTimeout(this.swiperTimeout);
    }
  }
}
