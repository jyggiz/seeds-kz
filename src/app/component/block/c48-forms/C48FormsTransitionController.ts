import AbstractTransitionController from '../../AbstractTransitionController';
import C48Forms from './C48Forms.lazy';
import { TimelineMax } from 'gsap';

class C48FormsTransitionController extends AbstractTransitionController<C48Forms> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C48Forms, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: C48Forms, id: string): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C48Forms,
    id: string,
  ): void {}
}

export default C48FormsTransitionController;
