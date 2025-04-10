import AbstractTransitionController from '../../AbstractTransitionController';
import C17Sectors from './C17Sectors.lazy';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import eases from '../../../animation/eases';
import M18Paragraph from 'app/component/molecule/m18-paragraph/M18Paragraph';
class C17SectorsTransitionController extends AbstractTransitionController<C17Sectors> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C17Sectors, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    const description = parent.getElement(`[data-component="${M18Paragraph.displayName}"]`);
    const sectorButtons = parent.getElements(`[data-sector]`);

    timeline.staggerFromTo(
      sectorButtons.filter((element) => element !== null),
      0.6,
      {
        y: 150,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        clearProps: 'y,opacity,visibility',
        stagger: {
          amount: 0.6,
        },
      },
      0,
    );
    if (description) {
      timeline.fromTo(
        description,
        0.6,
        {
          y: 150,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
          clearProps: 'y,opacity,visibility',
        },
        0,
      );
    }

    title && timeline.add(this.getTimeline(title), 0);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C17Sectors,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C17Sectors,
    id: string,
  ): void {}
}

export default C17SectorsTransitionController;
