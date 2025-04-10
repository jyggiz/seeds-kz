import AbstractTransitionController from '../../AbstractTransitionController';
import C03Blinds from './C03Blinds.lazy';
import { TimelineMax } from 'gsap';
import {
  SplitAnimationStart,
  splitWordAnimationHorizontal,
  splitWordAnimationVertical,
} from '../../../animation/splitTextAnimation';
import A03Heading from 'app/component/atom/a03-heading/A03Heading';
import { SplitText } from '../../../vendor/gsap/SplitText';
import O20Blind from 'app/component/organism/o20-blind/O20Blind.lazy';
import { hasPreferReduceMotion } from 'app/util/mediaQuery/hasPreferReduceMotion';

class C03BlindsTransitionController extends AbstractTransitionController<C03Blinds> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C03Blinds, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    if (hasPreferReduceMotion()) {
      return;
    }

    const blinds = parent.getElements(`[data-component="${O20Blind.displayName}"]`);
    const blindHeader = parent.getElements('[data-blinds-header]');
    const title = parent.getElement(`[data-component="${A03Heading.displayName}"]`);

    timeline.staggerFromTo(
      blinds.filter((element) => element !== null),
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

    timeline.staggerFromTo(
      blindHeader.filter((element) => element !== null),
      0.4,
      {
        x: -50,
        autoAlpha: 0,
      },
      {
        x: 0,
        autoAlpha: 1,
        clearProps: 'y,opacity,visibility',
        stagger: {
          amount: 0.5,
        },
      },
      0,
    );

    blindHeader.forEach((element) => {
      const splitElement = new SplitText(element, { type: 'lines,words' });
      timeline.add(splitWordAnimationHorizontal(splitElement, 'left' as SplitAnimationStart), 1);
    });

    if (title) {
      const splitTitle = new SplitText(title, { type: 'lines,words' });
      timeline.add(splitWordAnimationVertical(splitTitle, 'left' as SplitAnimationStart), 1.4);
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C03Blinds,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C03Blinds,
    id: string,
  ): void {}
}

export default C03BlindsTransitionController;
