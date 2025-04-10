import AbstractTransitionController from 'app/component/AbstractTransitionController';
import C111ShuffleHeroSlider from './C111ShuffleHeroSlider.lazy';
import { TimelineMax } from 'gsap';

class C111ShuffleHeroSliderTransitionController extends AbstractTransitionController<C111ShuffleHeroSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C111ShuffleHeroSlider,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C111ShuffleHeroSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C111ShuffleHeroSlider,
    id: string,
  ): void {}
}

export default C111ShuffleHeroSliderTransitionController;
