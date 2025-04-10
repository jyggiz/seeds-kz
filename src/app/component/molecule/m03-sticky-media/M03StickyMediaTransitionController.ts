import AbstractTransitionController from '../../AbstractTransitionController';
import { TimelineMax } from 'gsap';
import M03StickyMedia from './M03StickyMedia.lazy';

class M03StickyMediaTransitionController extends AbstractTransitionController<M03StickyMedia> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: M03StickyMedia,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M03StickyMedia,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M03StickyMedia,
    id: string,
  ): void {}
}

export default M03StickyMediaTransitionController;
