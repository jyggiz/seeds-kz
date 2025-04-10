import AbstractTransitionController from 'app/component/AbstractTransitionController';
import O102CardsGrid from './O102CardsGrid.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';

class O102CardsGridTransitionController extends AbstractTransitionController<O102CardsGrid> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O102CardsGrid,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const items = parent.getElements(`[data-item]`);
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
    parent: O102CardsGrid,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O102CardsGrid,
    id: string,
  ): void {}
}

export default O102CardsGridTransitionController;
