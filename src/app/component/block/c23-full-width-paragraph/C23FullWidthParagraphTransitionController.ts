import AbstractTransitionController from '../../AbstractTransitionController';
import C23FullWidthParagraph from './C23FullWidthParagraph.lazy';
import { TimelineMax } from 'gsap';
import ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import eases from '../../../animation/eases';

class C23FullWidthParagraphTransitionController extends AbstractTransitionController<C23FullWidthParagraph> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C23FullWidthParagraph,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const heading = parent.getElement(`[data-component="${ComponentHeader.displayName}"]`);
    const paragraphs = parent.getElement(`[data-paragraphs]`);

    if (heading) {
      timeline.add(this.getTimeline(heading), 0);
    }

    if (paragraphs) {
      timeline.fromTo(
        paragraphs,
        0.5,
        {
          autoAlpha: 0,
          y: 150,
        },
        {
          autoAlpha: 1,
          y: 0,
          ease: eases.VinnieInOut,
        },
        '-=0.8',
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C23FullWidthParagraph,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C23FullWidthParagraph,
    id: string,
  ): void {}
}

export default C23FullWidthParagraphTransitionController;
