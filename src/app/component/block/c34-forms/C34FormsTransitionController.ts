import AbstractTransitionController from '../../AbstractTransitionController';
import C34Forms from './C34Forms.lazy';
import { TimelineMax } from 'gsap';
import eases from 'app/animation/eases';

class C34FormsTransitionController extends AbstractTransitionController<C34Forms> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C34Forms, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const formFieldGroups = parent.getElements('.mc-field-group');
    const checkboxItems = parent.getElements('.o-investorForm__checkBoxListItem');

    timeline.staggerFromTo(
      formFieldGroups.filter((element) => element !== null),
      0.6,
      {
        x: 150,
        autoAlpha: 0,
      },
      {
        x: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.8,
        },
      },
      0,
    );

    timeline.staggerFromTo(
      checkboxItems.filter((element) => element !== null),
      0.4,
      {
        y: 50,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.6,
        },
      },
      0,
    );
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: C34Forms, id: string): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C34Forms,
    id: string,
  ): void {}
}

export default C34FormsTransitionController;
