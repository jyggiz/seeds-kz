import AbstractTransitionController from '../../AbstractTransitionController';
import O44FilterOptionList from './O44FilterOptionList.lazy';
import { TimelineMax } from 'gsap';

class O44FilterOptionListTransitionController extends AbstractTransitionController<O44FilterOptionList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O44FilterOptionList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O44FilterOptionList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O44FilterOptionList,
    id: string,
  ): void {}
}

export default O44FilterOptionListTransitionController;
