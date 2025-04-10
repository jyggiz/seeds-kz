import AbstractTransitionController from '../../AbstractTransitionController';
import C29Stories from './C29Stories.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';

class C29StoriesTransitionController extends AbstractTransitionController<C29Stories> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C29Stories, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    timeline.staggerFromTo(
      parent.getElements('[data-slide-in]').filter((element) => element !== null),
      1,
      {
        y: 600,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        clearProps: 'y,opacity,visibility',
        ease: eases.VinnieInOut,
        stagger: {
          amount: 1,
        },
      },
      0,
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C29Stories,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C29Stories,
    id: string,
  ): void {}
}

export default C29StoriesTransitionController;
