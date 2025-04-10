import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C38WindowsTransitionController from './C38WindowsTransitionController';
import { TweenMax } from 'gsap';
import { Collapsible } from '../../../util/collapsible/Collapsible';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import eases from '../../../animation/eases';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c38-windows.scss';

export default class C38Windows extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c38-windows';

  public readonly transitionController: C38WindowsTransitionController;

  private readonly windowItemsContent = this.getElements('[data-window-content]');
  private readonly windowItemsHeadings = this.getElements('[data-window-heading]');

  private readonly windowItems = this.getElements('[data-window-item]');
  private readonly collapsibles: Array<Collapsible> = [];

  private contentMaxHeight: number = 0;
  private headingMaxHeight: number = 0;
  private isLargeDevice: boolean =
    deviceStateTracker.currentDeviceState.state >= mq.deviceState.LARGE;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C38WindowsTransitionController(this);

    this.addEventListeners();
    if (this.isLargeDevice) this.initWindowContent();
    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);
  }

  private initWindowContent(): void {
    this.windowItemsContent.forEach((item) => {
      if (item.offsetHeight > this.contentMaxHeight) this.contentMaxHeight = item.offsetHeight;
    });

    this.windowItemsHeadings.forEach((heading) => {
      if (heading.offsetHeight > this.headingMaxHeight)
        this.headingMaxHeight = heading.offsetHeight;
    });
    this.setWindowContentHeight();
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private setWindowContentHeight(): void {
    this.windowItemsContent.forEach((item) => {
      TweenMax.set(item, {
        height: 0,
        opacity: 0,
      });
    });

    this.windowItemsHeadings.forEach((heading) => {
      TweenMax.set(heading, { height: this.headingMaxHeight });
    });
  }

  private addEventListeners(): void {
    this.windowItems.forEach((windowItem, index) => {
      const windowItemHeader = this.getElement('[data-window-header]', windowItem);
      const windowContent = this.getElement('[data-window-content]', windowItem);

      this.addDisposableEventListener<DeviceStateEvent>(
        deviceStateTracker,
        DeviceStateEvent.STATE_UPDATE,
        ({ data }) => this.handleDeviceStateChange(data),
      );

      this.addDisposableEventListener(windowItem, 'mouseover', () => {
        this.handleWindowItemMouseOver(windowItem, index);
      });

      this.addDisposableEventListener(windowItem, 'mouseleave', () => {
        this.handleWindowItemMouseLeave(windowItem, index);
      });

      if (!this.isLargeDevice) {
        windowItemHeader &&
          this.addDisposableEventListener(windowItemHeader, 'click', () =>
            this.handleWindowItemClick(windowItem),
          );

        windowContent && this.collapsibles.push(new Collapsible(windowContent, this.element));
      }
    });
  }

  private handleWindowItemMouseOver(windowItem: HTMLElement, index: number): void {
    if (this.isLargeDevice) {
      this.element.classList.add(StateClassNames.SELECTED);

      TweenMax.to(this.windowItemsContent[index], 0.6, {
        height: this.contentMaxHeight,
        opacity: 1,
        ease: eases.VinnieInOut,
      });

      windowItem.classList.add(StateClassNames.ACTIVE);
    }
  }

  private handleWindowItemMouseLeave(windowItem: HTMLElement, index: number): void {
    if (this.isLargeDevice) {
      this.element.classList.remove(StateClassNames.SELECTED);

      TweenMax.to(this.windowItemsContent[index], 0.6, {
        height: 0,
        opacity: 0,
        ease: eases.VinnieInOut,
      });

      windowItem.classList.remove(StateClassNames.ACTIVE);
    }
  }

  private handleWindowItemClick(activeWindowItem: HTMLElement): void {
    const isExpanded = this.windowItems.some(
      (windowItem) =>
        windowItem === activeWindowItem && windowItem.classList.contains(StateClassNames.ACTIVE),
    );
    this.closeFeatures();

    if (!isExpanded) {
      this.openFeature(activeWindowItem);
    } else {
      this.updateCollapsibleState(activeWindowItem);
    }
  }

  private openFeature(windowItem: HTMLElement): void {
    this.isExpanded = true;
    windowItem.classList.add(StateClassNames.ACTIVE);

    this.updateCollapsibleState(windowItem);
  }

  private closeFeatures(): void {
    this.isExpanded = false;

    this.windowItems.forEach((windowItem) => {
      windowItem.classList.remove(StateClassNames.ACTIVE);
    });
  }

  private set isExpanded(isExpanded: boolean) {
    this.element.classList.toggle(StateClassNames.EXPANDED, isExpanded);
  }

  private updateCollapsibleState(windowItem: HTMLElement): void {
    if (!this.isLargeDevice) {
      this.collapsibles.forEach((collapsible, index) => {
        collapsible[index === this.windowItems.indexOf(windowItem) ? 'toggle' : 'collapse']();
      });
    }
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    this.collapsibles.forEach((collapsible) => {
      if (state < mq.deviceState.LARGE) {
        collapsible.collapse();
      } else {
        collapsible.expand();
      }
    });
  }
}
