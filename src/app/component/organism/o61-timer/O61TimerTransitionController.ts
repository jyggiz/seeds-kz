import AbstractTransitionController from '../../AbstractTransitionController';
import O61Timer from './O61Timer';
import { TimelineMax } from 'gsap';

class O61TimerTransitionController extends AbstractTransitionController<O61Timer> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: O61Timer, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: O61Timer, id: string): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O61Timer,
    id: string,
  ): void {}
}

export default O61TimerTransitionController;
