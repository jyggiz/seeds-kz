import AbstractTransitionController from '../../AbstractTransitionController';
import O88TransitionSlide from './O88TransitionSlide.lazy';
import { TimelineMax } from 'gsap';

class O88TransitionSlideTransitionController extends AbstractTransitionController<O88TransitionSlide> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O88TransitionSlide,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O88TransitionSlide,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O88TransitionSlide,
    id: string,
  ): void {}
}

export default O88TransitionSlideTransitionController;
