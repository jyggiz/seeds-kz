import AbstractTransitionController from 'app/component/AbstractTransitionController';
import { TimelineMax } from 'gsap';
import C119SliderView from './C119SliderView';

class C119SliderViewTransitionController extends AbstractTransitionController<C119SliderView> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C119SliderView,
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
    parent: C119SliderView,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C119SliderView,
    id: string,
  ): void {}
}

export default C119SliderViewTransitionController;
