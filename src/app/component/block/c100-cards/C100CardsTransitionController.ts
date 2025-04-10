import AbstractTransitionController from '../../AbstractTransitionController';
import C100Cards from './C100Cards.lazy';
import { TimelineMax } from 'gsap';
import O35ArticleCard from '../../organism/o35-article-card/O35ArticleCard.lazy';
import { slideFadeIn } from '../../../animation/slideFadeIn';

class C100CardsTransitionController extends AbstractTransitionController<C100Cards> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C100Cards, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const cards = parent.getElements(`[data-component="${O35ArticleCard.displayName}"]`);

    if (cards) timeline.add(slideFadeIn(cards, 0.6, 0.1));
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C100Cards,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C100Cards,
    id: string,
  ): void {}
}

export default C100CardsTransitionController;
