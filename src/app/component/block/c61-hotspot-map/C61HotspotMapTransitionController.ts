import AbstractTransitionController from '../../AbstractTransitionController';
import C61HotspotMap from './C61HotspotMap.lazy';
import { TimelineMax } from 'gsap';

class C61HotspotMapTransitionController extends AbstractTransitionController<C61HotspotMap> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C61HotspotMap,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C61HotspotMap,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C61HotspotMap,
    id: string,
  ): void {}
}

export default C61HotspotMapTransitionController;
