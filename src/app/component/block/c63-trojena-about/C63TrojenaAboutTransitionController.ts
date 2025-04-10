import AbstractTransitionController from '../../AbstractTransitionController';
import C63TrojenaAbout from './C63TrojenaAbout.lazy';
import { TimelineMax } from 'gsap';

class C63TrojenaAboutTransitionController extends AbstractTransitionController<C63TrojenaAbout> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C63TrojenaAbout,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C63TrojenaAbout,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C63TrojenaAbout,
    id: string,
  ): void {}
}

export default C63TrojenaAboutTransitionController;
