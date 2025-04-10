import AbstractTransitionController from '../../AbstractTransitionController';
import C08Highlights from './C08Highlights.lazy';
import { TimelineMax } from 'gsap';
import ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';

class C08HighlightsTransitionController extends AbstractTransitionController<C08Highlights> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C08Highlights,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${ComponentHeader.displayName}"]`);

    timeline.add(() => {}, 0.35);
    this.addSlideInElements(parent.getElements('[data-slide-in]'), timeline);

    if (title) {
      timeline.add(this.getTimeline(title), 0);
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C08Highlights,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C08Highlights,
    id: string,
  ): void {}
}

export default C08HighlightsTransitionController;
