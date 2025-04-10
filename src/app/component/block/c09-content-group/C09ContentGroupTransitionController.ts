import AbstractTransitionController from '../../AbstractTransitionController';
import C09ContentGroup from './C09ContentGroup.lazy';
import { TimelineMax } from 'gsap';

class C09ContentGroupTransitionController extends AbstractTransitionController<C09ContentGroup> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C09ContentGroup,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C09ContentGroup,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C09ContentGroup,
    id: string,
  ): void {}
}

export default C09ContentGroupTransitionController;
