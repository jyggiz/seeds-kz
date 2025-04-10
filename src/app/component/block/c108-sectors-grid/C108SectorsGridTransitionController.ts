import AbstractTransitionController from '../../AbstractTransitionController';
import C108SectorsGrid from './C108SectorsGrid.lazy';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';

class C108SectorsGridTransitionController extends AbstractTransitionController<C108SectorsGrid> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C108SectorsGrid,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    title && timeline.add(this.getTimeline(title), 0);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C108SectorsGrid,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C108SectorsGrid,
    id: string,
  ): void {}
}

export default C108SectorsGridTransitionController;
