import AbstractTransitionController from '../../AbstractTransitionController';
import C117FlipCards from './C117FlipCards.lazy';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import {
  SplitAnimationStart,
  splitWordAnimationVertical,
} from '../../../animation/splitTextAnimation';
import { SplitText } from '../../../vendor/gsap/SplitText';
import eases from '../../../animation/eases';

class C117FlipCardsTransitionController extends AbstractTransitionController<C117FlipCards> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C117FlipCards,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    const description = parent.getElement('[data-description]');
    const items = parent.getElements('[data-item]');

    title && timeline.add(this.getTimeline(title));

    if (description) {
      description.style.fontKerning = 'none';
      const descriptionSplit = new SplitText(description, { type: 'lines,words' });

      descriptionSplit &&
        timeline.add(splitWordAnimationVertical(descriptionSplit, SplitAnimationStart.LEFT));
    }

    timeline.staggerFromTo(
      items,
      0.6,
      {
        x: 100,
        autoAlpha: 0,
      },
      {
        x: 0,
        autoAlpha: 1,
        clearProps: 'x,opacity,visibility',
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.6,
        },
      },
      0,
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C117FlipCards,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C117FlipCards,
    id: string,
  ): void {}
}

export default C117FlipCardsTransitionController;
