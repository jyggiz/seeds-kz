import AbstractTransitionController from '../../AbstractTransitionController';
import M42OverlayBackground from './M42OverlayBackground';
import { TimelineMax } from 'gsap';

class M42OverlayBackgroundTransitionController extends AbstractTransitionController<M42OverlayBackground> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: M42OverlayBackground,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M42OverlayBackground,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M42OverlayBackground,
    id: string,
  ): void {}
}

export default M42OverlayBackgroundTransitionController;
