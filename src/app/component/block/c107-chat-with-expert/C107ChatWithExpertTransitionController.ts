import AbstractTransitionController from '../../AbstractTransitionController';
import C107ChatWithExpert from './C107ChatWithExpert.lazy';
import { TimelineMax } from 'gsap';

class C107ChatWithExpertTransitionController extends AbstractTransitionController<C107ChatWithExpert> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C107ChatWithExpert,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C107ChatWithExpert,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C107ChatWithExpert,
    id: string,
  ): void {}
}

export default C107ChatWithExpertTransitionController;
