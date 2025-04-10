import AbstractTransitionController from '../../AbstractTransitionController';
import C10Countdown from './C10Countdown';
import { TimelineMax } from 'gsap';

class C10CountdownTransitionController extends AbstractTransitionController<C10Countdown> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C10Countdown,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C10Countdown,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C10Countdown,
    id: string,
  ): void {}
}

export default C10CountdownTransitionController;
