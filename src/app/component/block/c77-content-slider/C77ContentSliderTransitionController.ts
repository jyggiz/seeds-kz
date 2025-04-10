import AbstractTransitionController from '../../AbstractTransitionController';
import C77ContentSlider from './C77ContentSlider.lazy';
import { TimelineMax } from 'gsap';

class C77ContentSliderTransitionController extends AbstractTransitionController<C77ContentSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C77ContentSlider,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C77ContentSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C77ContentSlider,
    id: string,
  ): void {}
}

export default C77ContentSliderTransitionController;
