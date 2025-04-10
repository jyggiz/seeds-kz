import AbstractTransitionController from '../../AbstractTransitionController';
import C19Map from './C19Map.lazy';
import { TimelineMax } from 'gsap';

class C19MapTransitionController extends AbstractTransitionController<C19Map> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C19Map, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: C19Map, id: string): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C19Map,
    id: string,
  ): void {}
}

export default C19MapTransitionController;
