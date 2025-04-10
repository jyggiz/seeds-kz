import AbstractTransitionController from '../../AbstractTransitionController';
import O88SearchBar from './O88SearchBar';
import { TimelineMax } from 'gsap';

class O88SearchBarTransitionController extends AbstractTransitionController<O88SearchBar> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O88SearchBar,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O88SearchBar,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O88SearchBar,
    id: string,
  ): void {}
}

export default O88SearchBarTransitionController;
