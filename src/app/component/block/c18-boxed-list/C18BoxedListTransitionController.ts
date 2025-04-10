import AbstractTransitionController from '../../AbstractTransitionController';
import C18BoxedList from './C18BoxedList.lazy';
import { TimelineMax } from 'gsap';
import ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import { isEditor } from 'app/util/aemEditorUtils';
import eases from '../../../animation/eases';

class C18BoxedListTransitionController extends AbstractTransitionController<C18BoxedList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C18BoxedList,
    id: string,
  ): void {
    const isAemEditor = isEditor();
    if (isAemEditor) return;

    super.setupTransitionInTimeline(timeline, parent, id);

    const header = parent.getElement(`[data-component="${ComponentHeader.displayName}"]`);
    const boxedListCard = parent.getElements(`[data-boxed-list-card]`);

    if (header) timeline.add(this.getTimeline(header), 0);

    if (boxedListCard) {
      timeline.staggerFromTo(
        boxedListCard.filter((element) => element !== null),
        0.6,
        {
          y: 75,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
          clearProps: 'y,opacity,visibility',
          stagger: {
            amount: 0.3,
          },
        },
        0,
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C18BoxedList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C18BoxedList,
    id: string,
  ): void {}
}

export default C18BoxedListTransitionController;
