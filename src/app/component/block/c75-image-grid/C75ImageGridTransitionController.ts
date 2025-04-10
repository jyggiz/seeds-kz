import AbstractTransitionController from '../../AbstractTransitionController';
import C75ImageGrid from './C75ImageGrid.lazy';
import { TimelineMax } from 'gsap';
import eases from 'app/animation/eases';

class C75ImageGridTransitionController extends AbstractTransitionController<C75ImageGrid> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C75ImageGrid,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const items = parent.getElements('[data-item]');
    const pagination = parent.getElement('[data-pagination]');

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
        stagger: 0.1,
      },
    );

    if (pagination) {
      timeline.fromTo(
        pagination,
        0.4,
        {
          y: 150,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        0.3,
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C75ImageGrid,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C75ImageGrid,
    id: string,
  ): void {}
}

export default C75ImageGridTransitionController;
