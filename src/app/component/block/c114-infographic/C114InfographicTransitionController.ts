import AbstractTransitionController from '../../AbstractTransitionController';
import C114Infographic from './C114Infographic.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';

class C114InfographicTransitionController extends AbstractTransitionController<C114Infographic> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C114Infographic,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
    const gallerySlides = parent.getElements('[data-slide]');
    const galleryControls = parent.getElement('[data-controls]');

    if (gallerySlides) {
      timeline.staggerFromTo(
        gallerySlides.filter((slide) => slide !== null),
        0.8,
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
            amount: 0.5,
          },
        },
        0,
        '0',
      );
    }

    if (galleryControls) {
      timeline.from(
        galleryControls,
        0.5,
        {
          opacity: 0,
          ease: eases.VinnieInOut,
        },
        '0.4',
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C114Infographic,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C114Infographic,
    id: string,
  ): void {}
}

export default C114InfographicTransitionController;
