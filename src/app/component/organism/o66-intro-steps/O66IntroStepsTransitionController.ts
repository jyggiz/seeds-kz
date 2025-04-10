import AbstractTransitionController from '../../AbstractTransitionController';
import O66IntroSteps from './O66IntroSteps.lazy';
import { Power2, TimelineMax } from 'gsap';
import App from 'app/component/layout/app/App';
import { getAppComponent } from 'app/util/getElementComponent';
import O65MobileInstructions from '../o65-mobile-instructions/O65MobileInstructions.lazy';

class O66IntroStepsTransitionController extends AbstractTransitionController<O66IntroSteps> {
  protected async setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O66IntroSteps,
    id: string,
  ): Promise<void> {
    super.setupTransitionInTimeline(timeline, parent, id);
    let app: App | null = null;
    if (!window.location.href.includes('viewMode=story')) {
      app = await getAppComponent();
    }

    const parentElement = parent.element.parentElement;

    const imageContainers = parent.getElements('[data-region-hotspots-image-container]');
    const videoContainer = parent.getElement('[data-region-hotspots-video-container]');
    const hotspotMap = parentElement?.querySelector<HTMLElement>('[data-region-hotspot-map]');
    const mobileInstructions = parentElement?.querySelector<HTMLElement>(
      `[data-component="${O65MobileInstructions.displayName}"]`,
    );
    const clipTransitionDuration = 3;
    const style = window.getComputedStyle(parent.element);
    const zIndex = style.zIndex;

    const onIntroIsImages = () => {
      imageContainers.forEach((container, index) => {
        const stagger = index === 0 ? 0 : 1.5;
        const image = parent.getElement('[data-image-wrapper]', container);
        const caption = parent.getElement('[data-region-hotspots-caption]', container);
        if (image)
          timeline
            .to(
              image,
              clipTransitionDuration,
              {
                '--start': 2,
                ease: Power2.easeOut,
              },
              `-=${stagger}`,
            )
            .to(
              image,
              5,
              {
                scale: 1.2,
                ease: 'none',
              },
              `-=${clipTransitionDuration}`,
            );
        if (caption) {
          if (index === 1) {
            const fromProps = { opacity: 0 };
            const toProps = { opacity: 1 };
            timeline.set(caption, { css: { visibility: 'visible', opacity: 0 } }, `-=4.8`);
            timeline.fromTo(caption, clipTransitionDuration, fromProps, toProps, `-=4.5`);
          } else if (index === 2) {
            const fromProps = { opacity: 0 };
            const toProps = { opacity: 1 };
            timeline.set(caption, { css: { visibility: 'visible' } }, `-=5.5`);
            timeline.fromTo(caption, clipTransitionDuration, fromProps, toProps, `-=4`);
          } else {
            const fromProps = { opacity: 1 };
            const toProps = { opacity: 0 };
            timeline.fromTo(caption, clipTransitionDuration, fromProps, toProps, `-=4`);
          }
        }
      });

      if (hotspotMap)
        timeline.set(hotspotMap, { css: { pointerEvents: 'all' } }, `-=1.5`).to(
          hotspotMap,
          clipTransitionDuration,
          {
            '--start': 2,
            ease: Power2.easeOut,
          },
          `-=1.5`,
        );
      if (mobileInstructions) {
        timeline.to(
          mobileInstructions,
          0,
          {
            zIndex: `${parseInt(zIndex) + 1}`,
          },
          `-=${clipTransitionDuration}`,
        );
      }
    };

    const onIntroIsVideo = async () => {
      const getVideoDuration = (video: HTMLVideoElement): Promise<number> => {
        if (video.duration) {
          return Promise.resolve(video.duration);
        } else {
          return new Promise((res, rej) => {
            video.onloadedmetadata = () => {
              res(video.duration);
            };
          });
        }
      };
      const onHotspotMapTransitionIsClearToPlay = (delay?: number) => {
        if (hotspotMap) {
          timeline
            .set(hotspotMap, { css: { pointerEvents: 'none' } }, 0)
            .to(hotspotMap, clipTransitionDuration, {
              '--start': 2,
              ease: Power2.easeOut,
              delay,
              pointerEvents: 'all',
            });
        }
        if (mobileInstructions) {
          timeline.to(
            mobileInstructions,
            0,
            {
              zIndex: `${parseInt(zIndex) + 1}`,
            },
            `-=${clipTransitionDuration}`,
          );
        }
      };

      if (!videoContainer) {
        onHotspotMapTransitionIsClearToPlay();
        return;
      }
      const video: HTMLVideoElement | null = videoContainer.querySelector('[data-video]');

      if (!video) {
        onHotspotMapTransitionIsClearToPlay();
        return;
      }

      try {
        const videoDuration = await getVideoDuration(video);

        const captions = parent.getElements('[data-region-hotspots-caption]', videoContainer);
        let fadeInDurationTotal: number = 0;
        let fadeOutDurationTotal: number = 0;
        let normalStateDurationTotal: number = 0;
        const defaultCaptionAnimationDuration = videoDuration / captions.length;

        captions.forEach((caption, index) => {
          const fadeInDuration = defaultCaptionAnimationDuration * 0.3;
          const fadeOutDuration = defaultCaptionAnimationDuration * 0.2;
          const normalStateDuration = defaultCaptionAnimationDuration * 0.4;

          fadeInDurationTotal += fadeInDuration;
          fadeOutDurationTotal += fadeOutDuration;
          normalStateDurationTotal += normalStateDuration;

          timeline.from(caption, fadeInDuration, { opacity: 0 });
          timeline.to(caption, normalStateDuration, { opacity: 1 });
          index !== captions.length - 1 && timeline.to(caption, fadeOutDuration, { opacity: 0 });
        });
        const delay =
          videoDuration - (fadeInDurationTotal + fadeOutDurationTotal + normalStateDurationTotal);
        onHotspotMapTransitionIsClearToPlay(delay);
      } catch (err) {
        onHotspotMapTransitionIsClearToPlay();
      }
    };

    imageContainers.length ? onIntroIsImages() : await onIntroIsVideo();

    parent.onTransitionIsSetup();
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O66IntroSteps,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O66IntroSteps,
    id: string,
  ): void {}
}

export default O66IntroStepsTransitionController;
