import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import M46MediaCard from '../../molecule/m46-media-card/M46MediaCard';
import C64NewsList from './C64NewsList.lazy';

class C64NewsListTransitionController extends AbstractTransitionController<C64NewsList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C64NewsList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const header = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    const cards = parent.getElements(`[data-component="${M46MediaCard.displayName}"]`);

    header && timeline.add(this.getTimeline(header));

    if (cards) {
      timeline.staggerFromTo(
        cards,
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
    parent: C64NewsList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C64NewsList,
    id: string,
  ): void {}
}

export default C64NewsListTransitionController;
