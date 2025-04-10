import AbstractTransitionController from '../../AbstractTransitionController';
import C99BlocksList from './C99BlocksList.lazy';
import { TimelineMax } from 'gsap';
import { slideScaleFadeIn } from 'app/animation/slideFadeIn';
import { isEditor } from 'app/util/aemEditorUtils';

class C99BlocksListTransitionController extends AbstractTransitionController<C99BlocksList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C99BlocksList,
    id: string,
  ): void {
    const isAemEditor = isEditor();
    if (isAemEditor) return;

    super.setupTransitionInTimeline(timeline, parent, id);

    slideScaleFadeIn(parent.getElements(`.b-blocksList__item`), 1, 0.2);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C99BlocksList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C99BlocksList,
    id: string,
  ): void {}
}

export default C99BlocksListTransitionController;
