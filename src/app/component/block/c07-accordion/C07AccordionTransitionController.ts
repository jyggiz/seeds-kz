import AbstractTransitionController from '../../AbstractTransitionController';
import C07Accordion from './C07Accordion.lazy';
import { TimelineMax } from 'gsap';
import A03Heading from 'app/component/atom/a03-heading/A03Heading';
import O06CollapsibleItem from 'app/component/organism/o06-collapsible-item/O06CollapsibleItem.lazy';
import eases from 'app/animation/eases';

class C07AccordionTransitionController extends AbstractTransitionController<C07Accordion> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C07Accordion,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const heading = parent.getElement(`[data-component="${A03Heading.displayName}"]`);
    const items = parent.getElements(`[data-component="${O06CollapsibleItem.displayName}"]`);

    if (heading) {
      timeline.from(heading, 0.4, {
        opacity: 0,
        y: 50,
      });
    }

    timeline.staggerFromTo(
      items.filter((element) => element !== null),
      0.6,
      {
        x: 100,
        autoAlpha: 0,
      },
      {
        x: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.6,
        },
      },
      0,
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C07Accordion,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C07Accordion,
    id: string,
  ): void {}
}

export default C07AccordionTransitionController;
