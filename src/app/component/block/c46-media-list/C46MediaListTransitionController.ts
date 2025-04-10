import AbstractTransitionController from '../../AbstractTransitionController';
import C46MediaList from './C46MediaList.lazy';
import { TimelineMax } from 'gsap';

class C46MediaListTransitionController extends AbstractTransitionController<C46MediaList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C46MediaList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C46MediaList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C46MediaList,
    id: string,
  ): void {}
}

export default C46MediaListTransitionController;
