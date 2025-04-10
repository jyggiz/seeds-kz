import AbstractTransitionController from '../../AbstractTransitionController';
import O13ContentCard from './O13ContentCard.lazy';
import { TimelineMax } from 'gsap';

class O13ContentCardTransitionController extends AbstractTransitionController<O13ContentCard> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O13ContentCard,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O13ContentCard,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O13ContentCard,
    id: string,
  ): void {}
}

export default O13ContentCardTransitionController;
