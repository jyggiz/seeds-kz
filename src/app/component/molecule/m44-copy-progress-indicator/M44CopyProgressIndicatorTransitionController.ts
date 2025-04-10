import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import M44CopyProgressIndicator from './M44CopyProgressIndicator.lazy';

class M44CopyProgressIndicatorTransitionController extends AbstractTransitionController<M44CopyProgressIndicator> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: M44CopyProgressIndicator,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M44CopyProgressIndicator,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M44CopyProgressIndicator,
    id: string,
  ): void {}
}

export default M44CopyProgressIndicatorTransitionController;
