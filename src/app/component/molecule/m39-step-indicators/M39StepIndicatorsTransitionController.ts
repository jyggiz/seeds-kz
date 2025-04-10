import AbstractTransitionController from '../../AbstractTransitionController';
import M39StepIndicators from './M39StepIndicators';
import { TimelineMax } from 'gsap';

class M39StepIndicatorsTransitionController extends AbstractTransitionController<M39StepIndicators> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: M39StepIndicators,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: M39StepIndicators,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: M39StepIndicators,
    id: string,
  ): void {}
}

export default M39StepIndicatorsTransitionController;
