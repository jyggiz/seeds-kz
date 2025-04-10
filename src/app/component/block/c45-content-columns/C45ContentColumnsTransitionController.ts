import AbstractTransitionController from '../../AbstractTransitionController';
import C45ContentColumns from './C45ContentColumns.lazy';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';

class C45ContentColumnsTransitionController extends AbstractTransitionController<C45ContentColumns> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C45ContentColumns,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const m04ComponentHeader = parent.getElement(
      `[data-component="${M04ComponentHeader.displayName}"]`,
    );

    if (m04ComponentHeader) {
      this.getTimeline(m04ComponentHeader).play();
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C45ContentColumns,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C45ContentColumns,
    id: string,
  ): void {}
}

export default C45ContentColumnsTransitionController;
