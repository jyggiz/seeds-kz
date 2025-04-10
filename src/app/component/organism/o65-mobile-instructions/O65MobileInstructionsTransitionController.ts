import { isEditor } from 'app/util/aemEditorUtils';
import AbstractTransitionController from '../../AbstractTransitionController';
import O65MobileInstructions from './O65MobileInstructions.lazy';
import { TimelineMax } from 'gsap';

class O65MobileInstructionsTransitionController extends AbstractTransitionController<O65MobileInstructions> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O65MobileInstructions,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O65MobileInstructions,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O65MobileInstructions,
    id: string,
  ): void {
    if (isEditor()) return;

    parent.icons.forEach((icon: HTMLElement) => {
      timeline.from(icon, 1.5, { autoAlpha: 0 });
      timeline.to(icon, 1.5, { autoAlpha: 0 });
    });
  }
}

export default O65MobileInstructionsTransitionController;
