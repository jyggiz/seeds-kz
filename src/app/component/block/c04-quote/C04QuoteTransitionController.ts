import AbstractTransitionController from '../../AbstractTransitionController';
import C04Quote from './C04Quote.lazy';
import { TimelineMax } from 'gsap';

class C04QuoteTransitionController extends AbstractTransitionController<C04Quote> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C04Quote, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    this.addSlideInElements(parent.getElements('[data-slide-in]'), timeline);
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: C04Quote, id: string): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C04Quote,
    id: string,
  ): void {}
}

export default C04QuoteTransitionController;
