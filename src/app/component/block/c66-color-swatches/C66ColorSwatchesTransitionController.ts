import eases from 'app/animation/eases';
import A03Heading from 'app/component/atom/a03-heading/A03Heading';
import O63ColorSwatch from 'app/component/organism/o63-color-swatch/O63ColorSwatch.lazy';
import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import C66ColorSwatches from './C66ColorSwatches.lazy';

class C66ColorSwatchesTransitionController extends AbstractTransitionController<C66ColorSwatches> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C66ColorSwatches,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const colorSwatches = parent.getElements(`[data-component="${O63ColorSwatch.displayName}"]`);
    const description = parent.getElements(`[data-description]`);
    const header = parent.getElement(`[data-component="${A03Heading.displayName}"]`);
    const colorRatio = parent.getElement(`[data-color-ratio]`);

    const { disableTransition } = parent.element.dataset;
    if (disableTransition === 'true') return;

    if (header) {
      timeline.from(header, 0.5, {
        y: 50,
        autoAlpha: 0,
      });
    }

    if (description) {
      timeline.from(description, 0.5, {
        y: 50,
        autoAlpha: 0,
      });
    }

    if (colorRatio) {
      timeline.from(colorRatio, 0.5, {
        y: 50,
        autoAlpha: 0,
      });
    }

    timeline.staggerFromTo(
      colorSwatches.filter((element) => element !== null),
      0.4,
      {
        y: 150,
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

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C66ColorSwatches,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C66ColorSwatches,
    id: string,
  ): void {}
}

export default C66ColorSwatchesTransitionController;
