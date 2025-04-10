import AbstractTransitionController from 'app/component/AbstractTransitionController';
import { TimelineMax } from 'gsap';
import C119GridView from './C119GridView';

class C119GridViewTransitionController extends AbstractTransitionController<C119GridView> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C119GridView,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    timeline.fromTo(
      parent.element,
      1,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      },
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C119GridView,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C119GridView,
    id: string,
  ): void {}
}

export default C119GridViewTransitionController;
