import AbstractTransitionController from '../../AbstractTransitionController';
import C13WarningMessage from './C13WarningMessage.lazy';
import { TimelineMax } from 'gsap';

class C13WarningMessageTransitionController extends AbstractTransitionController<C13WarningMessage> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C13WarningMessage,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C13WarningMessage,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C13WarningMessage,
    id: string,
  ): void {}
}

export default C13WarningMessageTransitionController;
