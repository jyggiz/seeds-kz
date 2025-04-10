import AbstractTransitionController from '../../AbstractTransitionController';
import C115CardsGrid from './C115CardsGrid.lazy';
import { TimelineMax } from 'gsap';

class C115CardsGridTransitionController extends AbstractTransitionController<C115CardsGrid> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C115CardsGrid,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C115CardsGrid,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C115CardsGrid,
    id: string,
  ): void {}
}

export default C115CardsGridTransitionController;
