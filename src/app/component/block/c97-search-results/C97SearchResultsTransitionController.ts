import AbstractTransitionController from '../../AbstractTransitionController';
import C97SearchResults from './C97SearchResults.lazy';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';

class C97SearchResultsTransitionController extends AbstractTransitionController<C97SearchResults> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C97SearchResults,
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
    parent: C97SearchResults,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C97SearchResults,
    id: string,
  ): void {}
}

export default C97SearchResultsTransitionController;
