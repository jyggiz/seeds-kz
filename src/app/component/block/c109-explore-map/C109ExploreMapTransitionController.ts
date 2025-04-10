import AbstractTransitionController from '../../AbstractTransitionController';
import C109ExploreMap from './C109ExploreMap.lazy';
import { TimelineMax } from 'gsap';

class C109ExploreMapTransitionController extends AbstractTransitionController<C109ExploreMap> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C109ExploreMap,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C109ExploreMap,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C109ExploreMap,
    id: string,
  ): void {}
}

export default C109ExploreMapTransitionController;
