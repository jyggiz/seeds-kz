import AbstractTransitionController from '../../AbstractTransitionController';
import C25FullWidthAsset from './C25FullWidthAsset.lazy';
import { TimelineMax } from 'gsap';
import ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';

class C25FullWidthAssetTransitionController extends AbstractTransitionController<C25FullWidthAsset> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C25FullWidthAsset,
    id: string,
  ): void {
    const title = parent.getElement(`[data-component="${ComponentHeader.displayName}"]`);

    if (title) {
      timeline.add(this.getTimeline(title));
    }

    this.addSlideInElements([parent.getElement('[data-buttons]')], timeline);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C25FullWidthAsset,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C25FullWidthAsset,
    id: string,
  ): void {}
}

export default C25FullWidthAssetTransitionController;
