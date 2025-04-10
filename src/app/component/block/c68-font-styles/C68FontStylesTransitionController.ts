import AbstractTransitionController from '../../AbstractTransitionController';
import C68FontStyles from './C68FontStyles.lazy';
import { TimelineMax } from 'gsap';
import eases from 'app/animation/eases';

class C68FontStylesTransitionController extends AbstractTransitionController<C68FontStyles> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C68FontStyles,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C68FontStyles,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C68FontStyles,
    id: string,
  ): void {}

  public toggleAccordion(accordion: HTMLElement, isShown: boolean): void {
    const timeline = new TimelineMax();
    timeline.fromTo(
      accordion,
      1,
      {
        height: isShown ? 0 : accordion.scrollHeight,
      },
      {
        height: isShown ? accordion.scrollHeight : 0,
        duration: 2,
        ease: eases.VinnieInOut,
      },
    );
  }
}

export default C68FontStylesTransitionController;
