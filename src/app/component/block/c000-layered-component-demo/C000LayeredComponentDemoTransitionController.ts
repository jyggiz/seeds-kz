import AbstractTransitionController from '../../AbstractTransitionController';
import C000LayeredComponentDemo from './C000LayeredComponentDemo.lazy';
import { TimelineMax } from 'gsap';

class C000LayeredComponentDemoTransitionController extends AbstractTransitionController<C000LayeredComponentDemo> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C000LayeredComponentDemo,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C000LayeredComponentDemo,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C000LayeredComponentDemo,
    id: string,
  ): void {}
}

export default C000LayeredComponentDemoTransitionController;
