import AbstractTransitionController from '../../AbstractTransitionController';
import O90CardWaterfall from './O90CardWaterfall.lazy';
import { TimelineMax } from 'gsap';

class O90CardWaterfallTransitionController extends AbstractTransitionController<O90CardWaterfall> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O90CardWaterfall,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O90CardWaterfall,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O90CardWaterfall,
    id: string,
  ): void {}
}

export default O90CardWaterfallTransitionController;
