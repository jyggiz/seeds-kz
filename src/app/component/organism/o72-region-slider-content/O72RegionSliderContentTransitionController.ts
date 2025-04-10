import AbstractTransitionController from '../../AbstractTransitionController';
import O72RegionSliderContent from './O72RegionSliderContent.lazy';
import { TimelineMax } from 'gsap';

class O72RegionSliderContentTransitionController extends AbstractTransitionController<O72RegionSliderContent> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O72RegionSliderContent,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O72RegionSliderContent,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O72RegionSliderContent,
    id: string,
  ): void {}
}

export default O72RegionSliderContentTransitionController;
