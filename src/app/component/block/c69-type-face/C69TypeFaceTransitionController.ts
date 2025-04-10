import AbstractTransitionController from '../../AbstractTransitionController';
import C69TypeFace from './C69TypeFace.lazy';
import { TimelineMax } from 'gsap';

class C69TypeFaceTransitionController extends AbstractTransitionController<C69TypeFace> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C69TypeFace,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C69TypeFace,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C69TypeFace,
    id: string,
  ): void {}
}

export default C69TypeFaceTransitionController;
