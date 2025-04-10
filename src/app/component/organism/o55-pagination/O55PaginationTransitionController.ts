import AbstractTransitionController from '../../AbstractTransitionController';
import O55Pagination from './O55Pagination.lazy';
import { TimelineMax } from 'gsap';

class O55PaginationTransitionController extends AbstractTransitionController<O55Pagination> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O55Pagination,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O55Pagination,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O55Pagination,
    id: string,
  ): void {}
}

export default O55PaginationTransitionController;
