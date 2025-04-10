import AbstractTransitionController from '../../AbstractTransitionController';
import C78SocialMediaTeaserBar from './C78SocialMediaTeaserBar.lazy';
import { TimelineMax } from 'gsap';

class C78SocialMediaTeaserBarTransitionController extends AbstractTransitionController<C78SocialMediaTeaserBar> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C78SocialMediaTeaserBar,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C78SocialMediaTeaserBar,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C78SocialMediaTeaserBar,
    id: string,
  ): void {}
}

export default C78SocialMediaTeaserBarTransitionController;
