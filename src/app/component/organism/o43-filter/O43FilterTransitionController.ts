import AbstractTransitionController from '../../AbstractTransitionController';
import O43Filter from './O43Filter.lazy';
import { TimelineMax } from 'gsap';

class O43FilterTransitionController extends AbstractTransitionController<O43Filter> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: O43Filter, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O43Filter,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O43Filter,
    id: string,
  ): void {}
}

export default O43FilterTransitionController;
