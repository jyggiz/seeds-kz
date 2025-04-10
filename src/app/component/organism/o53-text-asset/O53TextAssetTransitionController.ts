import AbstractTransitionController from '../../AbstractTransitionController';
import O53TextAsset from './O53TextAsset.lazy';
import { TimelineMax } from 'gsap';

class O53TextAssetTransitionController extends AbstractTransitionController<O53TextAsset> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O53TextAsset,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O53TextAsset,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O53TextAsset,
    id: string,
  ): void {}
}

export default O53TextAssetTransitionController;
