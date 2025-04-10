import AbstractTransitionController from '../../AbstractTransitionController';
import C52FactsFigures from './C52FactsFigures.lazy';
import { TimelineMax } from 'gsap';
import M34ComponentBackground from '../../molecule/m34-component-background/M34ComponentBackground';

class C52FactsFiguresTransitionController extends AbstractTransitionController<C52FactsFigures> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C52FactsFigures,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const factsItems = parent.getElements('[data-facts-item]');
    const background = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );

    background && timeline.add(this.getTimeline(background));

    if (factsItems) {
      timeline.staggerFromTo(
        factsItems,
        0.5,
        {
          y: 100,
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
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C52FactsFigures,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C52FactsFigures,
    id: string,
  ): void {}
}

export default C52FactsFiguresTransitionController;
