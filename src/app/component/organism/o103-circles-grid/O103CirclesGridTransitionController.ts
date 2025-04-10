import AbstractTransitionController from 'app/component/AbstractTransitionController';
import O103CirclesGrid from './O103CirclesGrid.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';

class O103CirclesGridTransitionController extends AbstractTransitionController<O103CirclesGrid> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O103CirclesGrid,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const items = parent.getElements(`[data-circle-item]`);
    timeline.staggerFromTo(
      items.filter((element) => element !== null),
      0.4,
      {
        y: 150,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        clearProps: 'y,opacity,visibility',
        stagger: {
          amount: 0.4,
        },
      },
      0,
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O103CirclesGrid,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O103CirclesGrid,
    id: string,
  ): void {}
}

export default O103CirclesGridTransitionController;
