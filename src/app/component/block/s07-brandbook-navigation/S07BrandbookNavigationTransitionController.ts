import AbstractTransitionController from '../../AbstractTransitionController';
import S07BrandbookNavigation from './S07BrandbookNavigation';
import { TimelineMax } from 'gsap';

class S07BrandbookNavigationTransitionController extends AbstractTransitionController<S07BrandbookNavigation> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: S07BrandbookNavigation,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: S07BrandbookNavigation,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: S07BrandbookNavigation,
    id: string,
  ): void {}
}

export default S07BrandbookNavigationTransitionController;
