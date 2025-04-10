import AbstractTransitionController from '../../AbstractTransitionController';
import C47MotionBanner from './C47MotionBanner.lazy';
import { TimelineMax } from 'gsap';

class C47MotionBannerTransitionController extends AbstractTransitionController<C47MotionBanner> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C47MotionBanner,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C47MotionBanner,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C47MotionBanner,
    id: string,
  ): void {}
}

export default C47MotionBannerTransitionController;
