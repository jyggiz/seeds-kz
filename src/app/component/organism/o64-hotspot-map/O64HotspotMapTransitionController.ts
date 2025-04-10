import AbstractTransitionController from '../../AbstractTransitionController';
import O64HotspotMap from './O64HotspotMap.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';

class O64HotspotMapTransitionController extends AbstractTransitionController<O64HotspotMap> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O64HotspotMap,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O64HotspotMap,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const hotspots = parent.getElements('[data-hotspot]');

    timeline.from(parent.element, 0.5, {
      x: -200,
      autoAlpha: 0,
    });

    timeline.staggerFromTo(
      hotspots.filter((element) => element !== null),
      0.6,
      {
        y: 150,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.8,
        },
      },
      0,
    );
  }

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O64HotspotMap,
    id: string,
  ): void {}
}

export default O64HotspotMapTransitionController;
