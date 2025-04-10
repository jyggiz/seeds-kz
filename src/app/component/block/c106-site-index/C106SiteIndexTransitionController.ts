import AbstractTransitionController from '../../AbstractTransitionController';
import C106SiteIndex from './C106SiteIndex.lazy';
import { TimelineMax } from 'gsap';

class C106SiteIndexTransitionController extends AbstractTransitionController<C106SiteIndex> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C106SiteIndex,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const columns = parent.getElements('.b-siteIndex__sectionColumn');

    timeline.staggerFrom(
      columns,
      0.5,
      {
        opacity: 0,
        y: 50,
        ease: 'expo.out',
      },
      0.1,
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C106SiteIndex,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C106SiteIndex,
    id: string,
  ): void {}
}

export default C106SiteIndexTransitionController;
