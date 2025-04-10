import AbstractTransitionController from '../../AbstractTransitionController';
import C44ArticleContent from './C44ArticleContent.lazy';
import { TimelineMax } from 'gsap';

class C44ArticleContentTransitionController extends AbstractTransitionController<C44ArticleContent> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C44ArticleContent,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const articleBanner = parent.getElement('[data-article-banner]');
    const articleContainer = parent.getElement('[data-article-container]');

    if (articleBanner) {
      timeline.from(articleBanner, 0.5, {
        autoAlpha: 0,
      });
    }
    if (articleContainer) {
      timeline.from(articleContainer, 0.5, {
        autoAlpha: 0,
        y: 0,
      });
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C44ArticleContent,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C44ArticleContent,
    id: string,
  ): void {}
}

export default C44ArticleContentTransitionController;
