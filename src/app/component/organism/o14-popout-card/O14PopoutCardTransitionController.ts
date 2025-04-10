import AbstractTransitionController from '../../AbstractTransitionController';
import O14PopoutCard from './O14PopoutCard.lazy';
import { TimelineMax } from 'gsap';

class O14PopoutCardTransitionController extends AbstractTransitionController<O14PopoutCard> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O14PopoutCard,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O14PopoutCard,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O14PopoutCard,
    id: string,
  ): void {}
}

export default O14PopoutCardTransitionController;
