import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C03BlindsTransitionController from './C03BlindsTransitionController';
import { Collapsible } from '../../../util/collapsible/Collapsible';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import debounce from 'lodash-es/debounce';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c03-blinds.scss';

export default class C03Blinds extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c03-blinds';
  public static readonly WILL_CHANGE_CLASSNAME: string = '-willChange';

  public readonly transitionController: C03BlindsTransitionController;

  private readonly hotspotsContainer = this.getElement('[data-blinds-container]');
  private readonly header = this.getElement('[data-blinds-header]');
  private headerMouseEnterListener: (this: HTMLElement, event: MouseEvent) => any;
  private headerMouseLeaveListener: (this: HTMLElement, event: MouseEvent) => any;
  private readonly keyFeatures = this.getElements('[data-feature-item]');
  private readonly collapsibles: Array<Collapsible> = [];

  private isLargeDevice = deviceStateTracker.currentDeviceState.state > mq.deviceState.SMALL;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C03BlindsTransitionController(this);

    this.headerMouseEnterListener = this.toggleHeadingOpacity.bind(this, 'mouseenter');
    this.headerMouseLeaveListener = this.toggleHeadingOpacity.bind(this, 'mouseleave');

    this.addEventListeners();
    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);
  }

  private addEventListeners(): void {
    this.keyFeatures.forEach((keyFeature) => {
      const featureButton = this.getElement('[data-feature-item-content]', keyFeature);
      const featureContent = this.getElement('[data-feature-content]', keyFeature);

      if (!featureButton) throw new Error('The feature button cannot be found');
      if (!featureContent) throw new Error('The feature content cannot be found');

      this.addDisposableEventListener(featureButton, 'click', () =>
        this.handleKeyFeatureClick(keyFeature),
      );

      const mouseOverListener = debounce(() => this.handleKeyFeatureMouseOver(keyFeature), 100);

      this.addDisposableEventListener(keyFeature, 'mouseover', mouseOverListener);
      this.addDisposableEventListener(keyFeature, 'mouseleave', () => {
        // Make sure we cancel the old enter event when we leave to not build up a queue.
        mouseOverListener.cancel();
        this.handleKeyFeatureMouseLeave();
      });

      this.collapsibles.push(new Collapsible(featureContent, this.element));
    });

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      ({ data }) => this.handleDeviceStateChange(data),
    );
  }

  public async adopted() {
    setAsInitialised(this.element);
  }

  private toggleHeadingEventListeners() {
    if (!this.hotspotsContainer) return;

    if (this.isLargeDevice) {
      this.addDisposableEventListener(
        this.hotspotsContainer,
        'mouseenter',
        this.headerMouseEnterListener,
      );
      this.addDisposableEventListener(
        this.hotspotsContainer,
        'mouseleave',
        this.headerMouseLeaveListener,
      );
    } else {
      this.hotspotsContainer.removeEventListener('mouseenter', this.headerMouseEnterListener);
      this.hotspotsContainer.removeEventListener('mouseleave', this.headerMouseLeaveListener);
    }
  }

  private toggleHeadingOpacity(eventName: string): void {
    this.header && this.header.classList.toggle(StateClassNames.HIDDEN, eventName === 'mouseenter');
  }

  private handleKeyFeatureMouseOver(keyFeature: HTMLElement): void {
    if (this.isLargeDevice) this.openFeature(keyFeature);
  }

  private handleKeyFeatureMouseLeave(): void {
    if (this.isLargeDevice) this.closeFeatures();
  }

  private handleKeyFeatureClick(activeKeyFeature: HTMLElement): void {
    const isExpanded = this.keyFeatures.some(
      (keyFeature) =>
        keyFeature === activeKeyFeature && keyFeature.classList.contains(StateClassNames.ACTIVE),
    );

    this.closeFeatures();

    // Only open the new one if it wasn't already active
    if (!isExpanded) {
      this.openFeature(activeKeyFeature);
    } else {
      this.updateCollapsibleState(activeKeyFeature);
    }
  }

  private set isExpanded(isExpanded: boolean) {
    this.element.classList.toggle(StateClassNames.EXPANDED, isExpanded);
  }

  private updateCollapsibleState(keyFeature: HTMLElement): void {
    if (deviceStateTracker.currentDeviceState.state <= mq.deviceState.SMALL) {
      this.collapsibles.forEach((collapsible, index) => {
        collapsible[index === this.keyFeatures.indexOf(keyFeature) ? 'toggle' : 'collapse']();
      });
    }
  }

  private openFeature(keyFeature: HTMLElement): void {
    this.isExpanded = true;
    keyFeature.classList.add(C03Blinds.WILL_CHANGE_CLASSNAME);
    keyFeature.classList.add(StateClassNames.ACTIVE);
    // Make sure the collapsible is also updated
    this.updateCollapsibleState(keyFeature);
  }

  private closeFeatures(): void {
    this.isExpanded = false;

    this.keyFeatures.forEach((keyFeature) => {
      keyFeature.classList.remove(C03Blinds.WILL_CHANGE_CLASSNAME);
      keyFeature.classList.remove(StateClassNames.ACTIVE);
    });
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    this.isLargeDevice = state > mq.deviceState.SMALL;

    this.collapsibles.forEach((collapsible) => {
      this.isLargeDevice ? collapsible.expand() : collapsible.collapse();
    });

    this.toggleHeadingEventListeners();
  }
}
