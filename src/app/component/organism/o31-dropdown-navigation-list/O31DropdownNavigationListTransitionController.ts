import AbstractTransitionController from '../../AbstractTransitionController';
import O31DropdownNavigationList from './O31DropdownNavigationList';
import { TimelineMax } from 'gsap';

class O31DropdownNavigationListTransitionController extends AbstractTransitionController<O31DropdownNavigationList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O31DropdownNavigationList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O31DropdownNavigationList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O31DropdownNavigationList,
    id: string,
  ): void {}
}

export default O31DropdownNavigationListTransitionController;
