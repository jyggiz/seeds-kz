import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import C26HeroBanner from './C26HeroBanner';
import O60HeroContent from '../../organism/o60-hero-content/O60HeroContent';

class C26HeroBannerTransitionController extends AbstractTransitionController<C26HeroBanner> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C26HeroBanner,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const heroContent = parent.getElement(`[data-component="${O60HeroContent.displayName}"]`);

    heroContent && timeline.add(this.getTimeline(heroContent));
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C26HeroBanner,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C26HeroBanner,
    id: string,
  ): void {}
}

export default C26HeroBannerTransitionController;
