import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C73ScrollImageContentTransitionController from './C73ScrollImageContentTransitionController';
import ScrollHijackController from '../../../util/ScrollHijackController';
import debounce from 'lodash-es/debounce';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { isEditor } from '../../../util/aemEditorUtils';
import { TweenMax, TimelineMax } from 'gsap';
import type { Direction, LabelLocation } from './C73ScrollImageContent.types';
import A01Image from '../../atom/a01-image/A01Image';
import { rtlModifier } from '../../../util/rtlUtils';
import { clamp } from '../../../util/clamp';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c73-scroll-image-content.scss';

export default class C73ScrollImageContent extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c73-scroll-image-content';

  public readonly transitionController: C73ScrollImageContentTransitionController;

  private scrollHijackController: ScrollHijackController | null = null;

  private readonly scrollPinContainer = this.getElement('[data-scroll-pin-container]');
  private readonly items: ReadonlyArray<HTMLDivElement> = this.getElements('[data-item]');

  private readonly images: ReadonlyArray<HTMLDivElement> = this.getElements('img');
  private readonly imageWrappers: ReadonlyArray<HTMLDivElement> =
    this.getElements('[data-image-wrapper]');

  private contents: ReadonlyArray<HTMLDivElement> = this.getElements('[data-item-content]');

  private app: App | null = null;
  private isMobile = deviceStateTracker.currentDeviceState.state <= mq.deviceState.LARGE;

  private labelTransitions: ReadonlyArray<TimelineMax> = [];

  constructor(el: HTMLElement) {
    super(el);
    this.addEventListeners();
    this.transitionController = new C73ScrollImageContentTransitionController(this);
  }

  public async adopted(): Promise<void> {
    setAsInitialised(this.element);

    this.app = await getAppComponent();

    await document.fonts.ready;

    if (deviceStateTracker.currentDeviceState.state > 2) {
      await this.initScrollHijack();
    }
    this.setLabelLocations();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(window, 'resize', debounce(this.onResize.bind(this), 150));

    const resizeObserver = new ResizeObserver(() => this.setLabelLocations());

    this.imageWrappers.forEach((wrapper) => resizeObserver.observe(wrapper));

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  private async initScrollHijack(): Promise<void> {
    if (!this.app || isEditor()) return;

    this.tweenItem(0);

    TweenMax.set(this.element, {
      height: `${this.items.length * 100}vh`,
    });

    TweenMax.set(this.items.slice(1), {
      autoAlpha: 0,
    });

    this.scrollHijackController = await new ScrollHijackController({
      parentElement: this.element,
      onScrollBeforeInView: () => {
        if (!this.scrollPinContainer) return;
        TweenMax.set(this.scrollPinContainer, {
          position: 'absolute',
          top: 0,
          bottom: 'initial',
        });

        this.tweenItem(0);
      },
      onScrollInView: ({ progress }) => {
        if (!this.scrollPinContainer) return;
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

    this.labelTransitions = this.transitionController.initSectionTimelines(this.items);
  }

  private tweenItem(progress: number): void {
    const itemInterval = 1 / this.items.length;

    this.items.forEach((item, index) => {
      const content = this.contents[index];

      if (!content) return;
      const itemStart = index * itemInterval;
      const itemProgress = (progress - itemStart) * this.items.length;

      const labelTransition: TimelineMax | undefined = this.labelTransitions[index];

      if (itemProgress >= 0 && itemProgress <= 2) {
        if (
          itemProgress >= 0.5 &&
          itemProgress <= 1 &&
          !labelTransition?.isActive() &&
          labelTransition?.progress() === 0
        ) {
          this.setLabelLocations();
          labelTransition.play(0);
        } else if (itemProgress < 0 || itemProgress >= 1.75) {
          labelTransition?.pause(0);
        }
        TweenMax.set(item, {
          autoAlpha: clamp((itemProgress / 2) * 8, 0, 1),
        });

        TweenMax.set(content, {
          y: (itemProgress * -1 + 1) * 800,
        });
      } else {
        if (labelTransition) labelTransition.pause(0);

        TweenMax.set(item, {
          autoAlpha: 0,
        });
      }
    });
  }

  public setLabelLocations(): void {
    this.items.forEach((item) => {
      const labelWrapper = this.getElement<HTMLUListElement>('[data-label-wrapper]', item);
      const imageWrapper = this.getElement<HTMLImageElement>(
        `[data-component="${A01Image.displayName}"]`,
        item,
      );
      const image = this.getElement<HTMLImageElement>(
        `[data-component="${A01Image.displayName}"] img`,
        item,
      );
      const labels = this.getElements<HTMLLIElement>('[data-label]', item);

      if (imageWrapper) {
        if (deviceStateTracker.currentDeviceState.state <= 2) {
          TweenMax.set(imageWrapper, {
            marginBlock: Math.max(...labels.map((label) => label.clientHeight)) + 25,
          });
        } else {
          TweenMax.set(imageWrapper, {
            marginBlock: 0,
          });
        }
      }

      if (!labelWrapper || !image) return;
      labels.forEach((label) => {
        const location = label.dataset.location
          ? <LabelLocation>JSON.parse(label.dataset.location)
          : null;
        const align = <'start' | 'center'>(label.dataset.align ?? 'center');
        const direction = <Direction | undefined>label.dataset.direction ?? null;
        const line = this.getElement<HTMLSpanElement>('[data-line]', label);
        const dot = this.getElement<HTMLSpanElement>('[data-dot]', label);
        const copy = this.getElement<HTMLSpanElement>('[data-copy]', label);
        if (!location || !direction || !line || !dot || !copy) return;

        const padding = (labelWrapper.clientWidth - image.clientWidth) / 2;

        if (direction === 'vertical') {
          TweenMax.set(label, {
            x:
              ((location.x / 100) * image.clientWidth -
                (align === 'center' ? label.clientWidth / 2 : 0) +
                padding) *
              rtlModifier(),
            y: (location.y / 100) * image.clientHeight - label.clientHeight,
          });
        } else if (direction === 'verticalInverted') {
          TweenMax.set(label, {
            x:
              ((location.x / 100) * image.clientWidth -
                (align === 'center' ? label.clientWidth / 2 : 0) +
                padding) *
              rtlModifier(),
            y: (location.y / 100) * image.clientHeight - 8,
          });
        } else if (direction === 'horizontal') {
          const dotLocation = (location.x / 100) * image.clientWidth + padding;
          TweenMax.set(dot, {
            x: dotLocation * rtlModifier(),
          });

          TweenMax.set(line, {
            width: dotLocation - copy.clientWidth - dot.clientWidth / 2,
          });

          TweenMax.set(label, {
            y: (location.y / 100) * image.clientHeight - label.clientHeight / 2,
          });
        }
      });
    });
  }

  private async onResize(): Promise<void> {
    if (deviceStateTracker.currentDeviceState.state > 2) {
      if (!this.scrollHijackController) await this.initScrollHijack();
      if (!this.scrollHijackController) return;
      this.scrollHijackController.isActive = true;

      this.tweenItem(0);

      TweenMax.set(this.element, {
        height: `${this.items.length * 100}vh`,
      });

      TweenMax.set(this.items.slice(1), {
        autoAlpha: 0,
      });

      this.labelTransitions = this.transitionController.initSectionTimelines(this.items);
    } else {
      if (this.scrollHijackController) this.scrollHijackController.isActive = false;

      TweenMax.set([this.items, this.scrollPinContainer], {
        clearProps: 'position, top, bottom',
      });

      TweenMax.set(this.element, {
        height: 'auto',
      });

      TweenMax.set([this.items], {
        autoAlpha: 1,
        clearProps: 'autoAlpha',
      });

      TweenMax.set(this.contents, {
        y: 0,
        clearProps: 'y',
      });

      this.labelTransitions.forEach((timeline) => timeline.pause(timeline.duration()));

      if (this.scrollPinContainer)
        TweenMax.set(this.scrollPinContainer, {
          y: 0,
        });
    }

    setTimeout(this.setLabelLocations.bind(this), 150);
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    state > mq.deviceState.LARGE ? (this.isMobile = false) : (this.isMobile = true);
  }

  public dispose(): void {
    super.dispose();
    this.scrollHijackController?.dispose();
  }
}
