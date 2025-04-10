import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import debounce from 'lodash-es/debounce';
import { TweenMax, TimelineMax, Linear, Power2 } from 'gsap';
import Swiper, { Pagination } from 'swiper';
import O03VideoPlayer from '../../organism/o03-video-player/O03VideoPlayer.lazy';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { isRtl } from '../../../util/rtlUtils';
import C27RichQuoteTransitionController from './C27RichQuoteTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O12RichQuote from 'app/component/organism/o12-rich-quote/O12RichQuote.lazy';

import './c27-rich-quote.scss';
export default class C27RichQuote extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c27-rich-quote';

  public readonly transitionController: C27RichQuoteTransitionController;

  private readonly nextButton = this.getElement('[data-next]');
  private readonly previousButton = this.getElement('[data-previous]');
  private readonly slides = [...this.getElements('[data-slide]')];
  private readonly quotes = [...this.getElements('[data-quote]')];
  private readonly assetMasks = [...this.getElements('[data-asset-mask]')];
  private readonly assetWrappers = [...this.getElements('[data-asset-wrapper]')];
  private readonly videoPlayers = [
    ...this.getComponents<O03VideoPlayer>(O03VideoPlayer.displayName),
  ];
  private readonly slider = this.getElement('[data-slider]');
  private readonly pagination = this.getElement('[data-slider-pagination]');

  private currentIndex: number = 0;
  private isSliding: boolean = false;
  private isTextDirectionRtl: boolean = isRtl();
  private fixedAnimationDuration = 0.3;
  private swiperInstance: Swiper | null = null;

  private showPreviousThumbnail = this.slides.length > 2;

  private readonly nextThumbnailMasks: ReadonlyArray<HTMLElement> | undefined;
  private readonly previousThumbnailMasks: ReadonlyArray<HTMLElement> | undefined;
  private readonly nextThumbnailWrappers: ReadonlyArray<HTMLElement> | undefined;
  private readonly previousThumbnailWrappers: ReadonlyArray<HTMLElement> | undefined;
  private readonly nextThumbnailContent: ReadonlyArray<HTMLElement> | undefined;
  private readonly previousThumbnailContent: ReadonlyArray<HTMLElement> | undefined;
  private readonly slideContents: ReadonlyArray<HTMLElement> | undefined;

  private readonly ALIGNMENT = {
    RIGHT: { left: 'auto', right: '0' },
    LEFT: { left: '0', right: 'auto' },
  };
  private transitionVariables = {
    maskAlignment: { old: {}, new: {} },
    wrapperTranslationX: { old: '', new: '' },
    currentThumbnailMaskAlignment: {},
    newThumbnailMaskAlignment: {},
    currentThumbnailWrapperTranslationX: '',
    newThumbnailWrapperTranslationX: '',
  };

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C27RichQuoteTransitionController(this);

    const enableSlider = this.slides.length > 1;

    this.slideContents = this.getElements(`[data-component="${O12RichQuote.displayName}"]`);

    if (this.nextButton) {
      this.nextButton.addEventListener('click', this.onNextClick);
      this.nextThumbnailMasks = this.getElements('[data-thumbnail-mask]', this.nextButton);
      this.nextThumbnailWrappers = this.getElements('[data-thumbnail-wrapper]', this.nextButton);
      this.nextThumbnailContent = this.getElements('[data-thumbnail-information]', this.nextButton);
    }

    if (this.previousButton) {
      this.previousButton.addEventListener('click', this.onPreviousClick);
      this.previousThumbnailMasks = this.getElements('[data-thumbnail-mask]', this.previousButton);
      this.previousThumbnailWrappers = this.getElements(
        '[data-thumbnail-wrapper]',
        this.previousButton,
      );
      this.previousThumbnailContent = this.getElements(
        '[data-thumbnail-information]',
        this.previousButton,
      );
    }

    this.slides[this.currentIndex].classList.add(StateClassNames.ACTIVE);

    TweenMax.set(this.quotes, { autoAlpha: 0 });
    TweenMax.set(this.assetMasks, { width: '0%' });
    TweenMax.set(this.assetMasks[this.currentIndex], { width: '100%' });

    this.addDisposableEventListener(
      window,
      'resize',
      debounce(() => {
        this.resizeAssetWrappers();
        this.setSliderState();
        this.setSliderHeight();
      }, 150),
    );

    if (enableSlider) {
      this.resizeThumbnailWrappers();
      this.resizeAssetWrappers();
      this.setThumbnails();
      this.setSliderState();
      this.setSliderHeight();
    }
  }

  private setSliderHeight() {
    if (this.slider && this.slideContents) {
      const highestSlideValue = Math.max(...this.slideContents.map((o) => o.offsetHeight));
      this.slider.style.height = `${highestSlideValue}px`;
    }
  }

  private setThumbnails(): void {
    TweenMax.set([this.nextThumbnailContent, this.previousThumbnailContent], { autoAlpha: 0 });
    TweenMax.set([this.nextThumbnailMasks, this.previousThumbnailMasks], { width: '0%' });

    this.animateThumbnails(0, 0, 0);
  }

  private onNextClick = () => {
    if (this.isSliding) return;
    const toIndex = this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;

    if (deviceStateTracker.currentDeviceState.state < mq.deviceState.LARGE) {
      if (this.swiperInstance) {
        this.swiperInstance.slideTo(toIndex);
      }
    } else {
      this.selectItem(toIndex, 1);
    }
  };

  private onPreviousClick = () => {
    if (this.isSliding) return;
    const toIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.selectItem(toIndex, -1);
  };

  private selectItem(toIndex: number, direction: number) {
    const currentIndex = this.currentIndex;
    const toSlide = this.slides[toIndex];
    this.isSliding = true;
    this.currentIndex = toIndex;
    this.videoPlayers.forEach((videoPlayer) => videoPlayer.close());
    this.slides.forEach((slide) => {
      slide.classList.remove(StateClassNames.ACTIVE);
      slide.setAttribute('aria-hidden', 'true');
    });
    toSlide.classList.add(StateClassNames.ACTIVE);
    toSlide.setAttribute('aria-hidden', 'false');
    this.animateToItem(currentIndex, toIndex, direction);
    this.animateThumbnails(currentIndex, toIndex, direction);
  }

  private animateToItem(currentIndex: number, newIndex: number, direction: number) {
    const tl = new TimelineMax({});
    const currentQuote = this.quotes[currentIndex];
    const currentMask = this.assetMasks[currentIndex];
    const currentWrapper = this.assetWrappers[currentIndex];
    const newQuote = this.quotes[newIndex];
    const newMask = this.assetMasks[newIndex];
    const newWrapper = this.assetWrappers[newIndex];

    if (this.isTextDirectionRtl && direction === 1) {
      this.transitionVariables = {
        maskAlignment: { old: this.ALIGNMENT.RIGHT, new: this.ALIGNMENT.LEFT },
        wrapperTranslationX: { old: 'translateX(10%)', new: 'translateX(90%)' },
        currentThumbnailMaskAlignment: this.ALIGNMENT.RIGHT,
        newThumbnailMaskAlignment: this.ALIGNMENT.LEFT,
        currentThumbnailWrapperTranslationX: 'translateX(10%)',
        newThumbnailWrapperTranslationX: 'translateX(90%)',
      };
    } else if (this.isTextDirectionRtl && direction !== 1) {
      this.transitionVariables = {
        maskAlignment: { old: this.ALIGNMENT.LEFT, new: this.ALIGNMENT.RIGHT },
        wrapperTranslationX: { old: 'translateX(90%)', new: 'translateX(10%)' },
        currentThumbnailMaskAlignment: this.ALIGNMENT.LEFT,
        newThumbnailMaskAlignment: this.ALIGNMENT.RIGHT,
        currentThumbnailWrapperTranslationX: 'translateX(90%)',
        newThumbnailWrapperTranslationX: 'translateX(10%)',
      };
    } else if (!this.isTextDirectionRtl && direction === 1) {
      this.transitionVariables = {
        maskAlignment: { old: this.ALIGNMENT.LEFT, new: this.ALIGNMENT.RIGHT },
        wrapperTranslationX: { old: 'translateX(-10%)', new: 'translateX(-90%)' },
        currentThumbnailMaskAlignment: this.ALIGNMENT.LEFT,
        newThumbnailMaskAlignment: this.ALIGNMENT.RIGHT,
        currentThumbnailWrapperTranslationX: 'translateX(-10%)',
        newThumbnailWrapperTranslationX: 'translateX(-90%)',
      };
    } else if (!this.isTextDirectionRtl && direction !== 1) {
      this.transitionVariables = {
        maskAlignment: { old: this.ALIGNMENT.RIGHT, new: this.ALIGNMENT.LEFT },
        wrapperTranslationX: { old: 'translateX(-90%)', new: 'translateX(-10%)' },
        currentThumbnailMaskAlignment: this.ALIGNMENT.RIGHT,
        newThumbnailMaskAlignment: this.ALIGNMENT.LEFT,
        currentThumbnailWrapperTranslationX: 'translateX(-90%)',
        newThumbnailWrapperTranslationX: 'translateX(-10%)',
      };
    }

    // Out
    // Quote
    tl.to(currentQuote, this.fixedAnimationDuration, {
      autoAlpha: 0,
      x: this.isTextDirectionRtl ? 40 * direction : -40 * direction,
      ease: Power2.easeOut,
    });

    // Asset
    TweenMax.set(currentWrapper, { transform: 'translateX(0%)' });
    TweenMax.set(currentMask, this.transitionVariables.maskAlignment.old);

    tl.to(
      currentWrapper,
      this.fixedAnimationDuration,
      {
        transform: this.transitionVariables.wrapperTranslationX.old,
        ease: Linear.easeNone,
      },
      0,
    );
    tl.to(
      currentMask,
      this.fixedAnimationDuration,
      {
        width: '0%',
        ease: Linear.easeNone,
      },
      0,
    );

    // In
    // Quote
    tl.fromTo(
      newQuote,
      this.fixedAnimationDuration,
      {
        autoAlpha: 0,
        x: this.isTextDirectionRtl ? -40 * direction : 40 * direction,
      },
      {
        autoAlpha: 1,
        x: 0,
        ease: Power2.easeOut,
      },
      0.4,
    );

    // Asset
    TweenMax.set(newMask, this.transitionVariables.maskAlignment.new);
    TweenMax.set(newWrapper, {
      transform: this.transitionVariables.wrapperTranslationX.new,
    });
    tl.to(
      newWrapper,
      this.fixedAnimationDuration,
      {
        transform: 'translateX(0%)',
        ease: Linear.easeNone,
      },
      0,
    );
    tl.to(
      newMask,
      this.fixedAnimationDuration,
      {
        width: '100%',
        ease: Linear.easeNone,
      },
      0,
    );
  }

  private animateThumbnails(currentIndex: number, newIndex: number, direction: number) {
    if (!this.nextThumbnailMasks || (this.showPreviousThumbnail && !this.previousThumbnailMasks)) {
      throw new Error('Thumbnail masks not found');
    } else if (
      !this.nextThumbnailWrappers ||
      (this.showPreviousThumbnail && !this.previousThumbnailWrappers)
    ) {
      throw new Error('Thumbnail wrappers not found');
    } else if (
      !this.nextThumbnailContent ||
      (this.showPreviousThumbnail && !this.previousThumbnailContent)
    ) {
      throw new Error('Thumbnail content not found');
    }

    const currentPreviousIndex =
      currentIndex - 1 === -1 ? this.slides.length - 1 : currentIndex - 1;
    const currentNextIndex = currentIndex + 1 === this.slides.length ? 0 : currentIndex + 1;

    const newPreviousIndex = newIndex - 1 === -1 ? this.slides.length - 1 : newIndex - 1;
    const newNextIndex = newIndex + 1 === this.slides.length ? 0 : newIndex + 1;

    const tl = new TimelineMax({});

    const currentPreviousThumbnailMask = this.previousThumbnailMasks
      ? this.previousThumbnailMasks[currentPreviousIndex]
      : null;

    const newPreviousThumbnailMask = this.previousThumbnailMasks
      ? this.previousThumbnailMasks[newPreviousIndex]
      : null;

    const currentNextThumbnailMask = this.nextThumbnailMasks[currentNextIndex];
    const newNextThumbnailMask = this.nextThumbnailMasks[newNextIndex];

    const currentPreviousThumbnailWrapper = this.previousThumbnailWrappers
      ? this.previousThumbnailWrappers[currentPreviousIndex]
      : null;
    const currentNextThumbnailWrapper = this.nextThumbnailWrappers[currentNextIndex];

    const newPreviousThumbnailWrapper = this.previousThumbnailWrappers
      ? this.previousThumbnailWrappers[newPreviousIndex]
      : null;

    const newNextThumbnailWrapper = this.nextThumbnailWrappers[newNextIndex];

    const currentPreviousThumbnailContent = this.previousThumbnailContent
      ? this.previousThumbnailContent[currentPreviousIndex]
      : null;
    const currentNextThumbnailContent = this.nextThumbnailContent[currentNextIndex];

    const newPreviousThumbnailContent = this.previousThumbnailContent
      ? this.previousThumbnailContent[newPreviousIndex]
      : null;

    const newNextThumbnailContent = this.nextThumbnailContent[newNextIndex];

    if (
      (this.showPreviousThumbnail &&
        (!currentPreviousThumbnailContent ||
          !currentPreviousThumbnailMask ||
          !currentPreviousThumbnailWrapper)) ||
      !currentNextThumbnailContent ||
      !currentNextThumbnailMask ||
      !currentNextThumbnailWrapper
    ) {
      throw new Error('Current thumbnail element not found');
    } else if (
      (this.showPreviousThumbnail &&
        (!newPreviousThumbnailContent ||
          !newPreviousThumbnailMask ||
          !newPreviousThumbnailWrapper)) ||
      !newNextThumbnailContent ||
      !newNextThumbnailMask ||
      !newNextThumbnailWrapper
    ) {
      throw new Error('New thumbnail element not found');
    }

    if (currentPreviousThumbnailContent) {
      // Previous Thumbnbail Out
      tl.to(
        currentPreviousThumbnailContent,
        this.fixedAnimationDuration,
        {
          autoAlpha: 0,
          x: this.isTextDirectionRtl ? 40 * direction : -40 * direction,
          ease: Power2.easeOut,
        },
        0,
      );
    }

    if (currentPreviousThumbnailWrapper) {
      TweenMax.set(currentPreviousThumbnailWrapper, { transform: 'translateX(0%)' });
    }

    if (currentPreviousThumbnailMask) {
      TweenMax.set(
        currentPreviousThumbnailMask,
        this.transitionVariables.currentThumbnailMaskAlignment,
      );
    }

    if (currentPreviousThumbnailWrapper) {
      tl.to(
        currentPreviousThumbnailWrapper,
        this.fixedAnimationDuration,
        {
          transform: this.transitionVariables.currentThumbnailWrapperTranslationX,
          ease: Linear.easeNone,
        },
        0.2,
      );
    }

    if (currentPreviousThumbnailMask) {
      tl.to(
        currentPreviousThumbnailMask,
        this.fixedAnimationDuration,
        {
          width: '0%',
          ease: Linear.easeNone,
        },
        0.2,
      );
    }

    // Next Thumbnbail Out
    tl.to(
      currentNextThumbnailContent,
      this.fixedAnimationDuration,
      {
        autoAlpha: 0,
        x: this.isTextDirectionRtl ? 40 * direction : -40 * direction,
        ease: Power2.easeOut,
      },
      0,
    );

    TweenMax.set(currentNextThumbnailWrapper, { transform: 'translateX(0%)' });
    TweenMax.set(currentNextThumbnailMask, this.transitionVariables.currentThumbnailMaskAlignment);
    tl.to(
      currentNextThumbnailWrapper,
      this.fixedAnimationDuration,
      {
        transform: this.transitionVariables.currentThumbnailWrapperTranslationX,
        ease: Linear.easeNone,
      },
      0.2,
    );
    tl.to(
      currentNextThumbnailMask,
      this.fixedAnimationDuration,
      {
        width: '0%',
        ease: Linear.easeNone,
      },
      0.2,
    );

    if (newPreviousThumbnailContent) {
      // Previous Thumbnbail In
      tl.fromTo(
        newPreviousThumbnailContent,
        this.fixedAnimationDuration,
        {
          autoAlpha: 0,
          x: this.isTextDirectionRtl ? -40 * direction : 40 * direction,
        },
        {
          autoAlpha: 1,
          x: 0,
          ease: Power2.easeOut,
        },
        0.4,
      );
    }

    if (newPreviousThumbnailWrapper) {
      TweenMax.set(newPreviousThumbnailWrapper, {
        transform: this.transitionVariables.newThumbnailWrapperTranslationX,
      });
    }

    if (newPreviousThumbnailMask) {
      TweenMax.set(newPreviousThumbnailMask, this.transitionVariables.newThumbnailMaskAlignment);
    }

    if (newPreviousThumbnailWrapper) {
      tl.to(
        newPreviousThumbnailWrapper,
        this.fixedAnimationDuration,
        {
          transform: 'translateX(0%)',
          ease: Linear.easeNone,
        },
        0.2,
      );
    }

    if (newPreviousThumbnailMask) {
      tl.to(
        newPreviousThumbnailMask,
        this.fixedAnimationDuration,
        {
          width: '100%',
          ease: Linear.easeNone,
        },
        0.2,
      );
    }

    // Next Thumbnbail In

    tl.fromTo(
      newNextThumbnailContent,
      this.fixedAnimationDuration,
      {
        autoAlpha: 0,
        x: this.isTextDirectionRtl ? -40 * direction : 40 * direction,
      },
      {
        autoAlpha: 1,
        x: 0,
        ease: Power2.easeOut,
      },
      0.4,
    );

    TweenMax.set(newNextThumbnailWrapper, {
      transform: this.transitionVariables.newThumbnailWrapperTranslationX,
    });
    TweenMax.set(newNextThumbnailMask, this.transitionVariables.newThumbnailMaskAlignment);
    tl.to(
      newNextThumbnailWrapper,
      this.fixedAnimationDuration,
      {
        transform: 'translateX(0%)',
        ease: Linear.easeNone,
      },
      0.2,
    );
    tl.to(
      newNextThumbnailMask,
      this.fixedAnimationDuration,
      {
        width: '100%',
        ease: Linear.easeNone,
        onComplete: () => {
          this.isSliding = false;
        },
      },
      0.2,
    );
  }

  private resizeAssetWrappers() {
    if (this.assetWrappers) {
      this.assetWrappers.forEach((assetWrapper, index) => {
        const assetMask = this.assetMasks[index];
        const assetRatio = assetMask && assetMask.parentElement;

        if (assetRatio) {
          assetWrapper.style.width = `${assetRatio.offsetWidth}px`;
        }
      });
    }
  }

  private resizeThumbnailWrappers() {
    if (this.nextThumbnailWrappers) {
      this.nextThumbnailWrappers.forEach((nextThumbnailWrapper, index) => {
        const thumbnailMask = this.nextThumbnailMasks && this.nextThumbnailMasks[index];
        const thumbnailAssetRatio = thumbnailMask && thumbnailMask.parentElement;

        if (thumbnailAssetRatio) {
          nextThumbnailWrapper.style.width = `${thumbnailAssetRatio.offsetWidth}px`;
        }
      });
    }
    if (this.previousThumbnailWrappers) {
      this.previousThumbnailWrappers.forEach((previousThumbnailWrapper, index) => {
        const thumbnailMask = this.previousThumbnailMasks && this.previousThumbnailMasks[index];
        const thumbnailAssetRatio = thumbnailMask && thumbnailMask.parentElement;

        if (thumbnailAssetRatio) {
          previousThumbnailWrapper.style.width = `${thumbnailAssetRatio.offsetWidth}px`;
        }
      });
    }
  }

  private setSliderState(): void {
    if (deviceStateTracker.currentDeviceState.state < mq.deviceState.XLARGE) {
      this.initSlider();
    } else {
      this.destroySlider();
    }
  }

  private initSlider() {
    Swiper.use([Pagination]);

    if (this.slider && !this.swiperInstance) {
      this.swiperInstance = new Swiper(this.slider, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 1,
        spaceBetween: 0,
        initialSlide: this.currentIndex || 0,
        pagination:
          this.slides.length > 1
            ? {
                bulletClass: 'a-pageIndicators__item',
                bulletElement: 'span',
                bulletActiveClass: StateClassNames.ACTIVE,
                currentClass: StateClassNames.ACTIVE,
                el: this.pagination,
                type: 'bullets',
              }
            : undefined,
      });

      this.swiperInstance.on('slideChange', (e) => {
        this.selectItem(e.realIndex, 1);
      });
    }
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private destroySlider() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy();
      this.swiperInstance = null;
    }
  }
}
