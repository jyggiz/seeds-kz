import AbstractTransitionController from '../../AbstractTransitionController';
import M47HamburgerMenu from './M47HamburgerMenu';
import { TimelineMax } from 'gsap';

class M47HamburgerMenuTransitionController extends AbstractTransitionController<M47HamburgerMenu> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: M47HamburgerMenu,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M47HamburgerMenu,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M47HamburgerMenu,
    id: string,
  ): void {}
}

export default M47HamburgerMenuTransitionController;
