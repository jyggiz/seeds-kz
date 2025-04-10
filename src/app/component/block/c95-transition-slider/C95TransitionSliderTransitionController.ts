import AbstractTransitionController from '../../AbstractTransitionController';
import C95TransitionSlider from './C95TransitionSlider.lazy';
import { TimelineMax } from 'gsap';
import O71RegionSliderNavigation from 'app/component/organism/o71-region-slider-navigation/O71RegionSliderNavigation.lazy';
import { StateClassNames } from 'app/data/enum/StateClassNames';

class C95TransitionSliderTransitionController extends AbstractTransitionController<C95TransitionSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C95TransitionSlider,
    id: string,
  ): void {
    const { introVideo } = parent;
    super.setupTransitionInTimeline(timeline, parent, id);

    const regionSliders = parent.getElements(
      `[data-component="${O71RegionSliderNavigation.displayName}"]`,
    );
    const slidesWrapper = parent.getElement('.b-transitionSlider__slidesWrapper');
    const cloudsOverlay = parent.getElement('.m-overlayBackground__overlayBackgrounds');

    regionSliders.forEach((regionSlider) => {
      timeline.add(this.getTimeline(regionSlider), 0);
    });

    if (introVideo) {
      if (parent.element.getBoundingClientRect().bottom < 0) {
        this.revealSlides(introVideo, slidesWrapper, cloudsOverlay);
      } else {
        timeline.add(() => {
          this.playVideoIntro(parent, introVideo, slidesWrapper, cloudsOverlay);
        });
      }
    }
  }

  private async playVideoIntro(
    parent: C95TransitionSlider,
    video: HTMLVideoElement,
    slidesWrapper: HTMLElement | null,
    cloudsOverlay: HTMLElement | null,
  ) {
    const revealContent = () => {
      const progress = video.currentTime / video.duration;

      if (progress > 0.7) {
        this.revealSlides(video, slidesWrapper, cloudsOverlay);

        video.removeEventListener('timeupdate', revealContent);
      }
    };

    parent.addDisposableEventListener(video, 'timeupdate', revealContent);

    try {
      await video.play();
    } catch (err) {
      this.revealSlides(video, slidesWrapper, cloudsOverlay);
    }
  }

  private revealSlides(
    video: HTMLVideoElement,
    slidesWrapper: HTMLElement | null,
    cloudsOverlay: HTMLElement | null,
  ) {
    video.classList.add(StateClassNames.HIDDEN);
    slidesWrapper?.classList.add(StateClassNames.VISIBLE);
    cloudsOverlay?.classList.add(StateClassNames.VISIBLE);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C95TransitionSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C95TransitionSlider,
    id: string,
  ): void {}
}

export default C95TransitionSliderTransitionController;
