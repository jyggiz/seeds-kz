import AbstractTransitionController from '../../AbstractTransitionController';
import O81MotionSlide from './O81MotionSlide.lazy';
import { TimelineMax } from 'gsap';
import mq from '../../../data/shared-variable/media-queries.json';
import deviceStateTracker from 'app/util/deviceStateTracker';

class O81MotionSlideTransitionController extends AbstractTransitionController<O81MotionSlide> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O81MotionSlide,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O81MotionSlide,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O81MotionSlide,
    id: string,
  ): void {}
}

export default O81MotionSlideTransitionController;
