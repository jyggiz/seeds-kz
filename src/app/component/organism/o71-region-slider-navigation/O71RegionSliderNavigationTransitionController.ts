import AbstractTransitionController from '../../AbstractTransitionController';
import O71RegionSliderNavigation from './O71RegionSliderNavigation.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';

class O71RegionSliderNavigationTransitionController extends AbstractTransitionController<O71RegionSliderNavigation> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O71RegionSliderNavigation,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const regionSliderContainer = parent.getElement('[data-region-slider-container]');

    regionSliderContainer &&
      timeline.fromTo(
        regionSliderContainer,
        1.2,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          opacity: 1,
          scale: 1,
          ease: eases.VinnieInOut,
        },
      );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O71RegionSliderNavigation,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O71RegionSliderNavigation,
    id: string,
  ): void {}
}

export default O71RegionSliderNavigationTransitionController;
