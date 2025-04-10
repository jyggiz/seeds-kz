import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import C60Tabs from './C60Tabs.lazy';

class C60TabsTransitionController extends AbstractTransitionController<C60Tabs> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C60Tabs, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: C60Tabs, id: string): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C60Tabs,
    id: string,
  ): void {}
}

export default C60TabsTransitionController;
