import { TweenMax } from 'gsap';
import { setTimeout } from 'seng-disposable-manager';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C103VerticalCarouselTransitionController from './C103VerticalCarouselTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import ScrollHijackController from '../../../util/ScrollHijackController';
import { isEditor } from '../../../util/aemEditorUtils';
import { clamp } from '../../../util/clamp';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import eases from '../../../animation/eases';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import A02Icon from '../../atom/a02-icon/A02Icon';
import A04Eyebrow from '../../atom/a04-eyebrow/A04Eyebrow';
import { isRtl } from '../../../util/rtlUtils';

import './c103-vertical-carousel.scss';

type MoveImageOutOfViewOptions = {
  innerContainerWidth: number;
  indexOffset: number;
  isAfterActive: boolean;
};

export default class C103VerticalCarousel extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c103-vertical-carousel';

  public readonly transitionController: C103VerticalCarouselTransitionController;

  private readonly wrapper = this.getElement<HTMLDivElement>('[data-wrapper]');
  private readonly container = this.getElement<HTMLDivElement>('[data-container]');
  private readonly imageList = this.getElement<HTMLUListElement>('[data-image-list]');
  private readonly imageItems = this.getElements<HTMLLIElement>('[data-image-item]');
  private readonly contentItems = this.getElements<HTMLLIElement>('[data-content-item]');
  private eyebrow = this.getElement(`[data-component=${A04Eyebrow.displayName}]`);
  public readonly scrollLabelIcon = this.getElement(
    `[data-scroll-label] > [data-component=${A02Icon.displayName}]`,
  );

  private navigationHeight: number = 0;
  private _activeIndex = 0;
  private scrollHijackController: ScrollHijackController | null = null;
  private app: App | null = null;
  private isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.LARGE_LANDSCAPE;
  private isScrollHijackInitialised = false;
  private shouldPinSliderBelowNavBar = false;
  private static readonly itemDictionary: ['image', 'content'] = ['image', 'content'];

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C103VerticalCarouselTransitionController(this);
  }

  public async adopted() {
    this.app = await getAppComponent();
    this.navigationHeight = (await this.app?.getNavigationHeight()) || 0;
    this.shouldPinSliderBelowNavBar = this.isMobile && this.sliderContentFitsOnViewPort;
    await this.initScrollHijack();
    this.activeIndex = 0;

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.transitionController.startLoopingAnimation();

    setAsInitialised(this.element);
  }

  private get sliderContentFitsOnViewPort(): boolean {
    return this.sliderContentHeight <= window.innerHeight - this.navigationHeight;
  }

  private get sliderContentHeight() {
    const eyebrowHeight = this.eyebrow?.offsetHeight || 0;

    const eyebrowMargin = this.eyebrow
      ? parseInt(window.getComputedStyle(this.eyebrow).marginBlockStart)
      : 0;

    const imageListHeight = this.imageList?.offsetHeight || 0;

    const contentItemsHeight = Math.max(
      ...this.contentItems.map((contentItem) => contentItem.offsetHeight),
    );

    const dataContainerPadding = this.container
      ? parseInt(window.getComputedStyle(this.container).paddingBlockStart) +
        parseInt(window.getComputedStyle(this.container).paddingBlockEnd)
      : 0;

    const contentHeight =
      eyebrowHeight + eyebrowMargin + imageListHeight + contentItemsHeight + dataContainerPadding;

    return contentHeight;
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.LARGE_LANDSCAPE;

    this.disposables.add(setTimeout(() => this.moveImageList(this.activeIndex, true), 200));
  }

  private get items(): ReadonlyArray<{
    [key in (typeof C103VerticalCarousel.itemDictionary)[number]]: HTMLLIElement;
  }> {
    return this.contentItems.map((content, index) => ({
      content,
      image: this.imageItems[index],
    }));
  }

  private async initScrollHijack(): Promise<void> {
    if (isEditor()) return;

    if (this.wrapper)
      TweenMax.set(this.wrapper, {
        height: `${this.contentItems.length * 100}vh`,
      });

    this.scrollHijackController = await new ScrollHijackController({
      parentElement: this.element,
      onScrollBeforeInView: ({ scrollPosition }) => {
        if (!this.container) return;

        if (
          this.shouldPinSliderBelowNavBar &&
          this.navigationHeight &&
          scrollPosition > -this.navigationHeight
        ) {
          TweenMax.set(this.container, {
            position: 'fixed',
            top: this.navigationHeight,
            bottom: 'initial',
          });
        } else
          TweenMax.set(this.container, {
            position: 'absolute',
            top: 0,
            bottom: 'initial',
          });
      },
      onScrollInView: () => {
        if (!this.container) return;

        TweenMax.set(this.container, {
          position: 'fixed',
          top: this.shouldPinSliderBelowNavBar ? this.navigationHeight : 0,
          bottom: 'initial',
        });
      },
      onScrollAfterInView: () => {
        if (!this.container) return;

        TweenMax.set(this.container, {
          position: 'absolute',
          bottom: this.shouldPinSliderBelowNavBar ? -this.navigationHeight : 0,
          top: 'initial',
        });
      },
      onScroll: ({ progress }) => {
        const activeIndex = clamp(
          Math.round(progress / (1 / (this.contentItems.length - 1))),
          0,
          this.contentItems.length - 1,
        );

        if (activeIndex !== this.activeIndex) {
          this.activeIndex = activeIndex;
        }

        this.disposables.add(
          setTimeout(() => {
            this.isScrollHijackInitialised = true;
          }, 200),
        );
      },
    }).initScrollHijack();
  }

  private set activeIndex(activeIndex: number) {
    C103VerticalCarousel.itemDictionary.forEach((option) =>
      this.items.forEach((item, index) =>
        item[option].classList.toggle(StateClassNames.ACTIVE, index === activeIndex),
      ),
    );
    this.moveImageList(activeIndex, !this.isScrollHijackInitialised);

    this._activeIndex = activeIndex;
  }

  private get activeIndex(): number {
    return this._activeIndex;
  }

  /**
   * Move image list to provided `index`'s location
   *
   * @param index {number} Current active index
   * @param init {boolean} When set to true will skip animation when moving the image list
   * */
  private moveImageList(index: number, init = false): void {
    const duration = !init ? 1 : 0;

    if (this.isMobile) this.moveImageListOnMobile(index, duration);
    else this.moveImageListOnDesktop(index, duration);
  }

  /**
   * Move image list when on mobile
   *
   * WARNING: Calling this method when not on mobile will throw an error!
   *
   * @param index {number} Current active index
   * @param duration {number | undefined} Duration in seconds. Defaults to `1`
   * */
  private moveImageListOnMobile(index: number, duration = 1): void {
    if (!this.imageList) throw new Error('No image list element found');
    if (!this.isMobile) throw new Error('Cannot call this function outside a mobile environment');

    const direction = isRtl() ? 1 : -1;

    TweenMax.to(this.imageList, duration, {
      x: this.imageItems[index].clientWidth * index * direction,
      ease: eases.VinnieInOut,
    });

    C103VerticalCarousel.resetImagePosition(this.imageItems);
  }

  private static resetImagePosition(images: HTMLElement | ReadonlyArray<HTMLElement>): void {
    TweenMax.set(images, {
      clearProps: 'all',
    });
  }

  /**
   * Move image list when on desktop
   *
   * WARNING: Calling this method when not on desktop will throw an error!
   *
   * @param index {number} Current active index
   * @param duration {number | undefined} Duration in seconds. Defaults to `1`
   * */
  private moveImageListOnDesktop(index: number, duration = 1): void {
    if (!this.imageList) throw new Error('No image list element found');
    if (this.isMobile) throw new Error('Cannot call this function outside a desktop environment');

    C103VerticalCarousel.resetImagePosition(this.imageList);

    const innerContainerWidth =
      (this.container?.clientWidth ?? 0) -
      parseFloat(
        (this.container && getComputedStyle(this.container))?.paddingInlineStart ?? '0px',
      ) *
        2;

    this.imageItems.forEach((image, imageIndex) => {
      if (imageIndex === index) C103VerticalCarousel.moveImageInView(image, duration);
      else
        C103VerticalCarousel.moveImageOutOfView(
          image,
          {
            indexOffset: Math.abs(index - imageIndex),
            isAfterActive: imageIndex > index,
            innerContainerWidth,
          },
          duration,
        );
    });
  }

  /**
   * Move the active image in the viewport
   * @param image {HTMLElement}
   * @param duration {number | undefined}
   * */
  private static moveImageInView(image: HTMLElement, duration = 1): void {
    TweenMax.to(image, duration, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      clearProps: 'all',
      ease: eases.VinnieInOut,
    });
  }

  /**
   * Move the inactive image outside the viewport
   * @param image {HTMLElement} Image element that should be moved
   * @param config {Partial<MoveImageOutOfViewOptions>} Configuration
   * @param duration {number | undefined}
   * */
  private static moveImageOutOfView(
    image: HTMLElement,
    config?: Partial<MoveImageOutOfViewOptions>,
    duration = 1,
  ): void {
    const { innerContainerWidth = 0, indexOffset = 1, isAfterActive = false } = config ?? {};

    const rtlModifier = isRtl() ? -1 : 1;
    const isAfterActiveImageModifier = isAfterActive ? 1 : -1;

    const imageXOffset = 80;
    const imageYOffset = 350;
    const imageSizeExtension = 50;

    TweenMax.to(image, duration, {
      x: (innerContainerWidth - image.clientWidth - imageXOffset) * rtlModifier * indexOffset,
      y:
        Math.max(window.innerHeight - imageYOffset, image.clientHeight + imageSizeExtension) *
        isAfterActiveImageModifier *
        indexOffset,
      ease: eases.VinnieInOut,
    });
  }

  public dispose() {
    super.dispose();

    this.scrollHijackController?.dispose();
  }
}
