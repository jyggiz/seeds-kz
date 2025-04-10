import AbstractTransitionController from '../../AbstractTransitionController';
import C24Content from './C24Content.lazy';
import { TimelineMax } from 'gsap';
class C24ContentTransitionController extends AbstractTransitionController<C24Content> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C24Content, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const contentItems = parent.getElements(`[data-content-item]`);

    timeline.staggerFromTo(
      contentItems.filter((item) => item !== null),
      0.7,
      {
        y: 70,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
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
    parent: C24Content,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C24Content,
    id: string,
  ): void {}
}

export default C24ContentTransitionController;
