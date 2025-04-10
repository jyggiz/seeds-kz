import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C18BoxedListTransitionController from './C18BoxedListTransitionController';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import Swiper, { Pagination } from 'swiper';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import M34ComponentBackground from 'app/component/molecule/m34-component-background/M34ComponentBackground';
import O34BoxedCard from 'app/component/organism/o34-boxed-card/O34BoxedCard.lazy';
import { setAsInitialised } from 'app/util/setAsInitialised';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { MODAL } from '../../../util/overlayActionTypes';
import { O09ModalCarouselContentProps } from '../../organism/o09-modal-carousel-content/O09ModalCarouselContent.types';
import { O34BoxedCardProps } from 'app/component/organism/o34-boxed-card/O34BoxedCard.types';

import './c18-boxed-list.scss';

const lazyO09Template = () =>
  import(
    '../../organism/o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;

export default class C18BoxedList extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c18-boxed-list';

  public readonly transitionController: C18BoxedListTransitionController;

  private readonly slider = this.getElement('[data-slider]');
  private readonly pagination = this.getElement('[data-slider-pagination]');

  private readonly boxBackgroundAssets = this.getElements(
    `[data-box-background] [data-component=${M34ComponentBackground.displayName}]`,
  );
  private readonly componentBackground = this.getElement(
    `:scope > [data-component=${M34ComponentBackground.displayName}]`,
  );
  private readonly componentVideoBackground =
    this.componentBackground &&
    this.getElement<HTMLVideoElement>('video', this.componentBackground);
  private readonly boxes = this.getComponents<O34BoxedCard>(O34BoxedCard.displayName);

  private swiperSlider: Swiper | null = null;

  private isMobile = deviceStateTracker.currentDeviceState.state < 2;

  private boxData = JSON.parse(<string>this.element.dataset.items);

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C18BoxedListTransitionController(this);

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);
  }

  public async adopted(): Promise<void> {
    this.app = await getAppComponent();

    setAsInitialised(this.element);

    this.addEventListeners();

    this.boxBackgroundAssets &&
      this.boxBackgroundAssets.forEach((asset) =>
        this.getElement<HTMLVideoElement>('video', asset)?.pause(),
      );
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    this.boxes.forEach((box, index: number) => {
      if (box.hasModal()) {
        this.addDisposableEventListener<Event>(box.element, 'click', (event) => {
          event.stopPropagation();

          if (box.isHeadingLink(event.target as HTMLElement)) {
            return;
          }

          this.onBoxClick(index);
        });
      }
    });

    if (this.boxBackgroundAssets) {
      this.boxes.forEach((box, index) => {
        const backgroundAsset = this.boxBackgroundAssets.find(
          (asset) => Number(asset.parentElement?.dataset.itemId) === index,
        );

        const video = this.getElement<HTMLVideoElement>('video', backgroundAsset);

        this.addDisposableEventListener(box.element, 'mouseenter', () => {
          if (this.isMobile) return;

          backgroundAsset?.classList.add(StateClassNames.ACTIVE);
          video?.play();
          this.componentVideoBackground && this.componentVideoBackground.pause();
          this.toggleBackgroundVisibility(false);
        });
        this.addDisposableEventListener(box.element, 'mouseleave', () => {
          if (this.isMobile) return;

          backgroundAsset?.classList.remove(StateClassNames.ACTIVE);
          video?.pause();
          this.componentVideoBackground && this.componentVideoBackground.play();
          this.toggleBackgroundVisibility(true);
        });
      });
    }
  }

  private toggleBackgroundVisibility(visible: boolean = false): void {
    this.componentBackground?.classList[!visible ? 'add' : 'remove'](StateClassNames.HIDDEN);
  }

  private initSlider() {
    if (this.isMobile) {
      this.boxBackgroundAssets[0]?.classList.add(StateClassNames.ACTIVE);
      this.toggleBackgroundVisibility(false);
      this.componentVideoBackground?.pause();
      this.getElement<HTMLVideoElement>('video', this.boxBackgroundAssets[0])?.play();
    }

    if (this.slider) {
      Swiper.use([Pagination]);

      this.swiperSlider = new Swiper(this.slider, {
        direction: 'horizontal',
        loop: false,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 0,
        on: {
          slideChange: ({ activeIndex }) => {
            if (this.isMobile) {
              this.boxBackgroundAssets.forEach((asset) => {
                const itemId = Number(asset.parentElement?.dataset.itemId);

                asset?.classList[activeIndex === itemId ? 'add' : 'remove'](StateClassNames.ACTIVE);
                this.getElement<HTMLVideoElement>('video', asset)?.[
                  activeIndex === itemId ? 'play' : 'pause'
                ]();
              });
            }
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
      });
    }
  }

  private destroySlider() {
    this.swiperSlider?.destroy();
    this.swiperSlider = null;
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    const isLargeViewport = state > mq.deviceState.SMALL;
    if (isLargeViewport && this.swiperSlider) {
      this.removeBoxMinWidth();
      this.destroySlider();
    } else if (!isLargeViewport && !this.swiperSlider) {
      this.setBoxMinWidth();
      this.initSlider();
    }

    this.isMobile = state < 2;
  }

  private setBoxMinWidth() {
    const maxWidth = Math.max(...this.boxes.map((box) => box.element.offsetWidth));
    this.boxes.forEach((box) => (box.element.style.minWidth = `${maxWidth}px`));
  }

  private removeBoxMinWidth() {
    this.boxes.forEach((box) => (box.element.style.minWidth = `initial`));
  }

  private getModalBoxIndex(boxIndex: number): number {
    return this.boxData.slice(0, boxIndex).filter((item: O34BoxedCardProps) => item.modal).length;
  }

  public async onBoxClick(index: number): Promise<void> {
    const fullBleedCarouselVariant = 'fullBleedCarousel';

    const [o09Template, overlay] = await Promise.all([lazyO09Template(), this.app?.overlay]);

    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: o09Template.default,
        data: {
          activeItemIndex: this.getModalBoxIndex(index),
          variant: fullBleedCarouselVariant,
          items: this.boxData.filter((box: O34BoxedCardProps) => box.modal),
        },
        options: {
          classnames: [`-${fullBleedCarouselVariant}`],
        },
      },
    });
  }

  public dispose() {
    super.dispose();
  }
}
