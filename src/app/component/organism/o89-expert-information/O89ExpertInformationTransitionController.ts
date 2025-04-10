import AbstractTransitionController from '../../AbstractTransitionController';
import O89ExpertInformation from './O89ExpertInformation.lazy';
import { TimelineMax } from 'gsap';

class O89ExpertInformationTransitionController extends AbstractTransitionController<O89ExpertInformation> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O89ExpertInformation,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O89ExpertInformation,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O89ExpertInformation,
    id: string,
  ): void {}
}

export default O89ExpertInformationTransitionController;
