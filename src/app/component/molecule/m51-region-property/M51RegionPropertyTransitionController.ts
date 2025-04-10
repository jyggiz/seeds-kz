import AbstractTransitionController from '../../AbstractTransitionController';
import M51RegionProperty from './M51RegionProperty';
import { TimelineMax } from 'gsap';

class M51RegionPropertyTransitionController extends AbstractTransitionController<M51RegionProperty> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: M51RegionProperty,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M51RegionProperty,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M51RegionProperty,
    id: string,
  ): void {}
}

export default M51RegionPropertyTransitionController;
