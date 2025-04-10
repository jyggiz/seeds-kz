import AbstractTransitionController from '../../AbstractTransitionController';
import O27PanelNavigation from './O27PanelNavigation';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import { isRtl } from 'app/util/rtlUtils';

class O27PanelNavigationTransitionController extends AbstractTransitionController<O27PanelNavigation> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O27PanelNavigation,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    if (parent.navigationOverlay == null || parent.navigationWrapper == null) {
      return;
    }

    timeline.to(parent.navigationWrapper, 0.6, {
      xPercent: 0,
      ease: eases.VinnieInOut,
    });
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: O27PanelNavigation): void {
    if (parent.navigationOverlay == null || parent.navigationWrapper == null) {
      return;
    }

    timeline.to(parent.navigationWrapper, 0.6, {
      xPercent: isRtl() ? -100 : 100,
      ease: eases.VinnieInOut,
    });
  }

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O27PanelNavigation,
    id: string,
  ): void {}
}

export default O27PanelNavigationTransitionController;
