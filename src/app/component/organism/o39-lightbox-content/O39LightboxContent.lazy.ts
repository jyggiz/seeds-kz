import AbstractComponent from 'app/component/AbstractComponent';
import { LIGHTBOX, POPUP } from 'app/util/overlayActionTypes';
import Swiper, { Navigation, Pagination } from 'swiper';
import { getComponentForElement } from 'muban-core';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getAppComponent } from '../../../util/getElementComponent';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import { updateClassForItems } from '../../../util/stateClassNamesToggle';
import App from '../../layout/app/App';
import { Key } from 'ts-key-enum';
import O01Video from '../o01-video/O01Video.lazy';
import { O25PopupMessageContentProps } from '../o25-popup-message-content/O25PopupMessageContent.types';

import './o39-lightbox-content.scss';

enum SLIDE_DIRECTION {
  FORWARD = 1,
  BACKWARD = -1,
}

const lazyO25Template = () =>
  import(
    '../../organism/o25-popup-message-content/o25-popup-message-content.hbs?include'
  ) as LoadTemplateImport<O25PopupMessageContentProps>;

export default class O39LightboxContent extends AbstractComponent {
  public static readonly displayName: string = 'o39-lightbox-content';

  private readonly slider = this.getElement('[data-lightbox-slider]');

  private readonly previousButton = this.getElement('[data-lightbox-previous-button]');
  private readonly nextButton = this.getElement('[data-lightbox-next-button]');

  private readonly downloadButtons = this.getElements('[data-lightbox-download]');
  private readonly pagination = this.getElement('[data-slider-pagination]');
  private readonly thumbnailSlides = this.getElements('[data-lightbox-thumbnail]');
  private readonly currentSlides = this.getElements('[data-current-slide]');
  private readonly isExtended = Boolean(this.element.dataset.isExtended || '');

  private readonly videos = this.getComponents<O01Video>(O01Video.displayName);

  private activeIndex: number = 0;
  private swiper: Swiper | null = null;
  private inSwipe = false;
  private isMobile: boolean = false;

  private dataArray: Array<string> = [];
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
    this.activeIndex = Number(el.dataset.index);

    this.initSlider();
    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);
    this.addEventListeners();
    this.updateActiveClasses(this.activeIndex);
  }

  public async adopted() {
    this.app = await getAppComponent();

    this.addDisposableEventListener(this.app?.element, 'overlayAction', (event) => {
      const type = (event as unknown as CustomEvent).detail.type;

      if (type === LIGHTBOX.CLOSE) {
        this.closeVideos();
      }
    });

    this.updateActiveClasses(this.activeIndex);

    if (this.isExtended) {
      this.setActiveSlide();
    }

    this.pauseInactiveVideos();
  }

  private initSlider(): void {
    Swiper.use([Navigation, Pagination]);
    if (this.slider) {
      const navigationOptions = this.isExtended
        ? {}
        : {
            nextEl: this.nextButton,
            prevEl: this.previousButton,
          };

      this.swiper = new Swiper(this.slider, {
        loop: false,
        direction: 'horizontal',
        allowTouchMove: true,
        slidesPerView: this.isExtended ? 'auto' : 1,
        spaceBetween: this.isExtended ? 20 : 10,
        navigation: navigationOptions,
        pagination: {
          bulletClass: 'a-pageIndicators__item',
          bulletElement: 'span',
          bulletActiveClass: StateClassNames.ACTIVE,
          currentClass: StateClassNames.ACTIVE,
          el: this.pagination,
          type: 'bullets',
        },
        threshold: this.isExtended ? 20 : 0,
        on: {
          touchMove: () => {
            this.inSwipe = true;
          },
          touchEnd: () => {
            setTimeout(() => {
              this.inSwipe = false;
            }, 200);
          },
          slideChange: () => {
            this.videos && this.videos.forEach((video) => video.player.pause());
          },
        },
        breakpoints: {
          1024: {
            allowTouchMove: this.isExtended,
          },
        },
      });
      this.swiper.activeIndex = this.activeIndex;
      this.swiper.slideTo(this.activeIndex, 0);
    }
  }

  private setActiveSlide() {
    const currentSlide = this.currentSlides[this.activeIndex];
    const currentThumbnailSlide = this.thumbnailSlides[this.activeIndex];

    if (currentSlide) {
      currentSlide.classList.add(StateClassNames.ACTIVE);
    }

    if (currentThumbnailSlide) {
      currentThumbnailSlide.classList.add(StateClassNames.ACTIVE);
    }
  }

  private pauseInactiveVideos() {
    const slides = this.isExtended ? this.currentSlides : this.thumbnailSlides;

    slides.forEach((slide, index) => {
      if (index !== this.activeIndex) {
        const videoPlayerElement = slide.querySelector<HTMLElement>('[data-component="o01-video"]');

        if (videoPlayerElement) {
          const videoPlayer = getComponentForElement<O01Video>(videoPlayerElement);
          if (videoPlayer) {
            videoPlayer.player.pause();
          }
        }
      }
    });
  }

  private changeActiveSlide(index: number) {
    if (this.isMobile) return;
    this.closeVideos();
    this.activeIndex = index;
    this.updateActiveClasses(this.activeIndex);
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.downloadButtons.forEach((button) => {
      this.addDisposableEventListener(button, 'click', (e) => {
        e.preventDefault();
        this.handleDownloadClick(button);
      });
    });

    if (this.isExtended) {
      this.thumbnailSlides.forEach((slide, index) => {
        this.addDisposableEventListener(slide, 'click', () => {
          this.changeActiveSlide(index);
        });

        this.addDisposableEventListener(slide, 'keydown', (event: KeyboardEvent) => {
          if (event.key === Key.Enter || event.key === ' ') {
            event.preventDefault();
            this.changeActiveSlide(index);
          }
        });
      });
    }

    if (this.nextButton && this.previousButton) {
      this.addDisposableEventListener(this.previousButton, 'click', () =>
        this.onButtonClick(SLIDE_DIRECTION.BACKWARD),
      );
      this.addDisposableEventListener(this.nextButton, 'click', () =>
        this.onButtonClick(SLIDE_DIRECTION.FORWARD),
      );
    }
  }

  private onButtonClick = (direction: SLIDE_DIRECTION): void => {
    const swiperButton =
      direction === SLIDE_DIRECTION.BACKWARD ? this.previousButton : this.nextButton;

    if (this.isDisabled(swiperButton)) {
      return;
    }

    if (this.isExtended) {
      const newIndex = (this.activeIndex || 0) + direction;
      this.swiper?.slideTo(newIndex);
    }

    this.activeIndex += direction;
    this.updateActiveClasses(this.activeIndex);
  };

  private isDisabled = (element: HTMLElement | null): boolean => {
    return (
      !!element?.hasAttribute('aria-disabled') && element?.getAttribute('aria-disabled') === 'true'
    );
  };

  private updateActiveClasses(activeIndex: number) {
    const isPrevButtonDisabled = activeIndex === 0;
    const isNextButtonDisabled = activeIndex === this.thumbnailSlides.length - 1;

    this.previousButton?.classList.toggle(StateClassNames.DISABLED, isPrevButtonDisabled);
    this.nextButton?.classList.toggle(StateClassNames.DISABLED, isNextButtonDisabled);

    this.previousButton?.setAttribute('aria-disabled', isPrevButtonDisabled.toString());
    this.nextButton?.setAttribute('aria-disabled', isNextButtonDisabled.toString());

    updateClassForItems({
      removeFrom: this.thumbnailSlides,
      addToOne: this.thumbnailSlides[activeIndex],
      className: StateClassNames.ACTIVE,
    });

    updateClassForItems({
      removeFrom: this.currentSlides,
      addToOne: this.currentSlides[activeIndex],
      className: StateClassNames.ACTIVE,
    });
  }

  private async handleDownloadClick(button: HTMLElement): Promise<void> {
    if (this.app === null) throw new Error('App was not found');

    const { terms } = this.element.dataset;
    const popupCopy = terms && JSON.parse(terms);
    const downloadHref = button.getAttribute('href');

    if (downloadHref) this.dataArray.push(downloadHref);

    const data = {
      content: popupCopy,
      mediaArray: this.dataArray,
    };

    if (terms) {
      const [template, overlay] = await Promise.all([lazyO25Template(), this.app.overlay]);

      await overlay.dispatchAction({
        type: POPUP.STANDARD_DYNAMIC,
        payload: {
          template: template.default,
          data,
        },
      });
      this.dataArray = [];
    }
  }

  private async onDeviceStateChange({ state }: IDeviceStateData): Promise<void> {
    this.isMobile = state <= mq.deviceState.MEDIUM;
  }

  public closeVideos(): void {
    this.videos &&
      this.videos.forEach((video) => {
        video.player.pause();
      });
  }
}
