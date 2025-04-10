import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import O29DropdownNavigation from './O29DropdownNavigation';

class O29DropdownNavigationTransitionController extends AbstractTransitionController<O29DropdownNavigation> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O29DropdownNavigation,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O29DropdownNavigation,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O29DropdownNavigation,
    id: string,
  ): void {}
}

export default O29DropdownNavigationTransitionController;
