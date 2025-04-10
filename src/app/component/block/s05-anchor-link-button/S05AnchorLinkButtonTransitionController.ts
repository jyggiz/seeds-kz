import AbstractTransitionController from '../../AbstractTransitionController';
import S05AnchorLinkButton from './S05AnchorLinkButton';
import { TimelineMax } from 'gsap';

class S05AnchorLinkButtonTransitionController extends AbstractTransitionController<S05AnchorLinkButton> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: S05AnchorLinkButton,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: S05AnchorLinkButton,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: S05AnchorLinkButton,
    id: string,
  ): void {}
}

export default S05AnchorLinkButtonTransitionController;
