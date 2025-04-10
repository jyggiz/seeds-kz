import { TimelineMax, TweenMax } from 'gsap';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C67ScrollStoriesTransitionController from './C67ScrollStoriesTransitionController';
import { isEditor } from '../../../util/aemEditorUtils';
import ScrollHijackController from '../../../util/ScrollHijackController';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c67-scroll-stories.scss';

export default class C67ScrollStories extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c67-scroll-stories';

  public readonly transitionController: C67ScrollStoriesTransitionController;

  private isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.LARGE;

  private readonly scrollPinContainer: HTMLDivElement | null = this.getElement(
    '[data-scroll-pin-container]',
  );
  private readonly items: ReadonlyArray<HTMLDivElement> = this.getElements('[data-item]');
  private readonly images: ReadonlyArray<HTMLDivElement> = this.getElements('[data-image]');
  private readonly contentItems: ReadonlyArray<HTMLDivElement> = this.getElements('[data-content]');

  private itemInTimelines: ReadonlyArray<TimelineMax> = [];

  private scrollHijackController: ScrollHijackController | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C67ScrollStoriesTransitionController(this);
  }

  public async adopted(): Promise<void> {
    setAsInitialised(this.element);

    this.addEventListeners();
    await this.initScrollHijack();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  private async initScrollHijack(): Promise<void> {
    if (isEditor()) return;

    TweenMax.set(this.element, {
      height: `${this.items.length * (this.isMobile ? 100 : 150)}vh`,
    });

    this.itemInTimelines = await Promise.all(
      this.contentItems.map((element) =>
        this.transitionController.setupItemTransitionInTimeline(element),
      ),
    );

    TweenMax.set([this.items.slice(1)], {
      autoAlpha: 0,
    });

    this.tweenItem(0);

    this.scrollHijackController = await new ScrollHijackController({
      parentElement: this.element,
      onScrollBeforeInView: ({ scrollPosition }) => {
        if (!this.scrollPinContainer) return;
        TweenMax.set(this.scrollPinContainer, {
          y: scrollPosition / 3,
          position: 'absolute',
          top: 0,
          bottom: 'initial',
        });

        TweenMax.set(this.contentItems, {
          clearProps: 'all',
        });

        this.tweenItem(0);
      },
      onScrollInView: ({ progress }) => {
        if (!this.scrollPinContainer) return;
        TweenMax.set(this.scrollPinContainer, {
          y: 0,
        });

        TweenMax.set(this.scrollPinContainer, {
          position: 'fixed',
          top: 0,
          bottom: 'initial',
        });

        TweenMax.set(this.items, {
          clearProps: 'position, top, bottom',
        });

        this.tweenItem(progress);
      },
      onScrollAfterInView: () => {
        if (!this.scrollPinContainer) return;

        TweenMax.set([this.scrollPinContainer, this.items], {
          position: 'absolute',
          bottom: 0,
          top: 'initial',
        });

        this.tweenItem(1);
      },
    }).initScrollHijack();
  }

  private tweenItem(progress: number): void {
    const itemInterval = 1 / this.items.length;

    this.items.forEach((item, index) => {
      if (!this.contentItems[index]) return;
      const itemStart = index * itemInterval;

      const image = this.images[index];
      const itemWrapper = this.items[index];

      const itemProgress = (progress - itemStart) * this.items.length;

      if (!image || !itemWrapper) return;

      C67ScrollStoriesTransitionController.tweenImage(itemProgress, index, image, itemWrapper);
      C67ScrollStoriesTransitionController.tweenContent(
        itemProgress,
        this.itemInTimelines[index],
        index,
        this.contentItems[index],
      );
    });
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    state > mq.deviceState.LARGE ? (this.isMobile = false) : (this.isMobile = true);
  }

  public dispose() {
    super.dispose();
    this.scrollHijackController?.dispose();
  }
}
