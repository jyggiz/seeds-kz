import AbstractTransitionController from '../../AbstractTransitionController';
import C76ButtonReference from './C76ButtonReference.lazy';
import { TimelineMax } from 'gsap';

class C76ButtonReferenceTransitionController extends AbstractTransitionController<C76ButtonReference> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C76ButtonReference,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C76ButtonReference,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C76ButtonReference,
    id: string,
  ): void {}
}

export default C76ButtonReferenceTransitionController;
