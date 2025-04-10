import AbstractTransitionController from '../../AbstractTransitionController';
import HighlightItem from './M13HighlightItem';
import { TimelineMax } from 'gsap';

class HighlightItemTransitionController extends AbstractTransitionController<HighlightItem> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: HighlightItem,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: HighlightItem,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: HighlightItem,
    id: string,
  ): void {}
}

export default HighlightItemTransitionController;
