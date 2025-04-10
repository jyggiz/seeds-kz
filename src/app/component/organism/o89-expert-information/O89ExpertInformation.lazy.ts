import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O89ExpertInformationTransitionController from './O89ExpertInformationTransitionController';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { toggleClass } from '../../../util/toggleClass';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import VideoTemplate from '../../atom/a19-video/a19-video.hbs?include';
import { TimelineMax, TweenMax } from 'gsap';
import { addEventListener } from 'seng-disposable-event-listener';
import { cleanElement } from 'muban-core';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DisposableManager } from 'seng-disposable-manager';
import { DeviceStateEvent } from 'seng-device-state-tracker';

import './o89-expert-information.scss';
export default class O89ExpertInformation extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o89-expert-information';

  public readonly transitionController: O89ExpertInformationTransitionController;

  private isMobile = deviceStateTracker.currentDeviceState.state < 2;

  private desktopVideoBackground?: string = this.element.dataset.videoBackground;
  private videoDisposableManager = new DisposableManager();
  private videoContainer = this.getElement<HTMLDivElement>('[data-video-container]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O89ExpertInformationTransitionController(this);
  }

  public async adopted(): Promise<void> {
    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  public setScrollState(state: 'top' | 'stick' | 'bottom', offset: number = 0): void {
    if (state === 'stick') {
      TweenMax.set(this.element, {
        position: 'fixed',
        top: 0,
        bottom: 'initial',
      });
    } else if (state === 'top') {
      TweenMax.set(this.element, {
        position: 'absolute',
        top: offset,
        bottom: 'initial',
      });
    } else if (state === 'bottom') {
      TweenMax.set(this.element, {
        position: 'absolute',
        bottom: offset,
        top: 'initial',
      });
    }
  }

  public toggleExpansion(force?: boolean): boolean {
    return toggleClass(this.element, StateClassNames.EXPANDED, force);
  }

  public get isExpanded(): boolean {
    return this.element.classList.contains(StateClassNames.EXPANDED);
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    if (state > mq.deviceState.LARGE) {
      this.isMobile = false;

      if (this.desktopVideoBackground) {
        const videoData: {
          src: string;
          type: string;
        } = JSON.parse(this.desktopVideoBackground);

        const videoContent = {
          autoloop: true,
          props: {
            sources: [{ ...videoData }],
          },
        };

        if (this.videoContainer) {
          const videoElementContainer = renderItem(
            <HTMLElement>this.videoContainer,
            VideoTemplate,
            videoContent,
          );
          const video = this.getElement('video', videoElementContainer);

          if (video) {
            const timeline = new TimelineMax({ paused: true });
            timeline.from(video, 0.5, {
              autoAlpha: 0,
            });

            this.videoDisposableManager.dispose();
            this.videoDisposableManager.add(
              addEventListener(video, 'loadeddata', () => timeline.play()),
            );
          }
        }
      }
    } else {
      this.isMobile = true;

      // @ts-ignore
      this.videoContainer && this.videoContainer.replaceChildren();
      this.videoContainer && cleanElement(this.videoContainer);
    }
  }
}
