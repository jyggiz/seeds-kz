import AbstractTransitionController from '../../AbstractTransitionController';
import C73ScrollImageContent from './C73ScrollImageContent.lazy';
import { TimelineMax, Back } from 'gsap';
import { Direction } from './C73ScrollImageContent.types';
import eases from '../../../animation/eases';

class C73ScrollImageContentTransitionController extends AbstractTransitionController<C73ScrollImageContent> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C73ScrollImageContent,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C73ScrollImageContent,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C73ScrollImageContent,
    id: string,
  ): void {}

  public initSectionTimelines(items: ReadonlyArray<HTMLDivElement>): ReadonlyArray<TimelineMax> {
    const component = <C73ScrollImageContent>this.parentController;

    return items.map((item) => {
      const timeline = new TimelineMax({ paused: true });

      const labels = component.getElements('[data-label]', item);

      labels.forEach((label, index) => {
        const direction = <Direction | null>label.dataset.direction ?? null;
        const line = component.getElement<HTMLSpanElement>('[data-line]', label);
        const dot = component.getElement<HTMLSpanElement>('[data-dot]', label);
        const copy = component.getElement<HTMLSpanElement>('[data-copy]', label);
        if (!direction || !line || !dot || !copy) return;

        const labelTimeline = new TimelineMax();

        labelTimeline.fromTo(
          dot,
          0.75,
          {
            scale: 0,
            boxShadow: `0 0 0 0px rgba(235, 192, 63, 0.75)`,
          },
          {
            scale: 1,
            boxShadow: `0 0 0 30px rgba(235, 192, 63, 0)`,
            ease: Back.easeOut,
          },
          '=-0.2',
        );

        if (direction === 'horizontal' || direction === 'horizontalInverted') {
          labelTimeline.fromTo(
            line,
            0.75,
            { scaleX: 0 },
            { scaleX: 1, ease: eases.VinnieInOut },
            '=-0.5',
          );
        } else {
          labelTimeline.fromTo(
            line,
            0.5,
            { scaleY: 0 },
            { scaleY: 1, ease: eases.VinnieInOut },
            '=-0.2',
          );
        }

        labelTimeline.fromTo(
          copy,
          0.5,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            ease: eases.VinnieInOut,
          },
          '=-0.2',
        );

        timeline.add(labelTimeline, index * 0.3);
      });

      return timeline;
    });
  }
}

export default C73ScrollImageContentTransitionController;
