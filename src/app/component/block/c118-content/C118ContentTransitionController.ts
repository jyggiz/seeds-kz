import AbstractTransitionController from 'app/component/AbstractTransitionController';
import C118Content from './C118Content.lazy';
import { TimelineMax } from 'gsap';

class C118ContentTransitionController extends AbstractTransitionController<C118Content> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C118Content,
    id: string,
  ): void {
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
    parent: C118Content,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C118Content,
    id: string,
  ): void {}
}

export default C118ContentTransitionController;
