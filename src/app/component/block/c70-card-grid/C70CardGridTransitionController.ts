import AbstractTransitionController from '../../AbstractTransitionController';
import C70CardGrid from './C70CardGrid.lazy';
import { TimelineMax } from 'gsap';

class C70CardGridTransitionController extends AbstractTransitionController<C70CardGrid> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C70CardGrid,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C70CardGrid,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C70CardGrid,
    id: string,
  ): void {}
}

export default C70CardGridTransitionController;
