import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import S08ScrollToTop from './S08ScrollToTop';

class S08ScrollToTopTransitionController extends AbstractTransitionController<S08ScrollToTop> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: S08ScrollToTop,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: S08ScrollToTop,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: S08ScrollToTop,
    id: string,
  ): void {}
}

export default S08ScrollToTopTransitionController;
