import AbstractTransitionController from '../../AbstractTransitionController';
import C28FactsAndFigures from './C28FactsAndFigures.lazy';
import { TimelineMax } from 'gsap';

class C28FactsAndFiguresTransitionController extends AbstractTransitionController<C28FactsAndFigures> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C28FactsAndFigures,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const figures = parent.getElements('[data-figure]');

    timeline.staggerFromTo(
      figures.filter((figure) => figure !== null),
      0.6,
      {
        y: 200,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        clearProps: 'y,opacity,visibility',
        stagger: {
          amount: 0.5,
        },
      },
      0,
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C28FactsAndFigures,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C28FactsAndFigures,
    id: string,
  ): void {}
}

export default C28FactsAndFiguresTransitionController;
