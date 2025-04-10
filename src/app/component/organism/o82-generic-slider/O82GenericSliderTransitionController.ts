import AbstractTransitionController from '../../AbstractTransitionController';
import O82GenericSlider from './O82GenericSlider.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';

class O82GenericSliderTransitionController extends AbstractTransitionController<O82GenericSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O82GenericSlider,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  public animateIn() {
    const timeline = new TimelineMax();
    const sliderItems = this.parentController.getElements('[data-slider-item]');

    timeline.staggerFromTo(
      sliderItems.filter((element) => element !== null),
      0.8,
      {
        x: 100,
        autoAlpha: 0,
      },
      {
        x: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.8,
        },
      },
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O82GenericSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O82GenericSlider,
    id: string,
  ): void {}
}

export default O82GenericSliderTransitionController;
