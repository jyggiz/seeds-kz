import AbstractTransitionController from '../../AbstractTransitionController';
import C57MotionSlider from './C57MotionSlider.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';

class C57MotionSliderTransitionController extends AbstractTransitionController<C57MotionSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C57MotionSlider,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  public slideInImage(index: number, image: HTMLElement, duration: number): void {
    const percentage = (index + 1) * 10;
    const timeline = new TimelineMax();
    timeline.fromTo(
      image,
      duration,
      {
        right: `${percentage}%`,
      },
      {
        right: 0,
        ease: eases.VinnieInOut,
      },
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C57MotionSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C57MotionSlider,
    id: string,
  ): void {}
}

export default C57MotionSliderTransitionController;
