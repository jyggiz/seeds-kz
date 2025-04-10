import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import O63ColorSwatch from './O63ColorSwatch.lazy';

class O63ColorSwatchTransitionController extends AbstractTransitionController<O63ColorSwatch> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O63ColorSwatch,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O63ColorSwatch,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O63ColorSwatch,
    id: string,
  ): void {}
}

export default O63ColorSwatchTransitionController;
