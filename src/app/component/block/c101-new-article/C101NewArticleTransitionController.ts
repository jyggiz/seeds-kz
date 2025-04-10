import AbstractTransitionController from '../../AbstractTransitionController';
import C101NewArticle from './C101NewArticle.lazy';
import { TimelineMax } from 'gsap';

class C101NewArticleTransitionController extends AbstractTransitionController<C101NewArticle> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C101NewArticle,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C101NewArticle,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C101NewArticle,
    id: string,
  ): void {}
}

export default C101NewArticleTransitionController;
