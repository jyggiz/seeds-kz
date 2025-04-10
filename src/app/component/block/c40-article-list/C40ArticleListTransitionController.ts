import eases from 'app/animation/eases';
import A03Heading from 'app/component/atom/a03-heading/A03Heading';
import O35ArticleCard from 'app/component/organism/o35-article-card/O35ArticleCard.lazy';
import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import C40ArticleList from './C40ArticleList.lazy';

class C40ArticleListTransitionController extends AbstractTransitionController<C40ArticleList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C40ArticleList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const header = parent.getElement(`[data-component="${A03Heading.displayName}"]`);
    const articleItems = parent.getElements(`[data-component="${O35ArticleCard.displayName}"]`);

    if (header) {
      timeline.from(header, 0.5, {
        y: 50,
        autoAlpha: 0,
      });
    }

    timeline.staggerFromTo(
      articleItems.filter((element) => element !== null),
      0.4,
      {
        y: 150,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
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
    parent: C40ArticleList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C40ArticleList,
    id: string,
  ): void {}
}

export default C40ArticleListTransitionController;
