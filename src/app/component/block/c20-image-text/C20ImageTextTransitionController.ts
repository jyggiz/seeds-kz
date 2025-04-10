import AbstractTransitionController from '../../AbstractTransitionController';
import C20ImageText from './C20ImageText.lazy';
import { TimelineMax } from 'gsap';

class C20ImageTextTransitionController extends AbstractTransitionController<C20ImageText> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C20ImageText,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const contentItems = parent.getElements('[data-content-item]');

    if (parent.element.hasAttribute('data-scroll-component')) {
      timeline.staggerFromTo(
        contentItems.filter((element) => element !== null),
        0.4,
        {
          y: 50,
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
    parent: C20ImageText,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C20ImageText,
    id: string,
  ): void {}
}

export default C20ImageTextTransitionController;
