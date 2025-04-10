import AbstractTransitionController from 'app/component/AbstractTransitionController';
import C116DynamicCarousel from './C116DynamicCarousel.lazy';
import { Expo, TimelineMax, TweenMax } from 'gsap';
import A04Eyebrow from '../../atom/a04-eyebrow/A04Eyebrow';
import A03Heading from '../../atom/a03-heading/A03Heading';
import A05Moustache from '../../atom/a05-moustache/A05Moustache';
import eases from '../../../animation/eases';

class C116DynamicCarouselTransitionController extends AbstractTransitionController<C116DynamicCarousel> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C116DynamicCarousel,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
    const headerItems = [
      parent.getElement(`[data-component="${A04Eyebrow.displayName}"]`),
      parent.getElement(`[data-component="${A03Heading.displayName}"]`),
      parent.getElement(`[data-component="${A05Moustache.displayName}"]`),
    ] as Array<HTMLElement>;
    const sorter = parent.getElement<HTMLElement>('[data-sorter]');
    const sliderItems = parent.getElements('[data-slider-item]');
    const carouselControls = parent.getElement<HTMLElement>('[data-controls]');

    timeline.staggerFrom(
      [...headerItems, sorter, ...sliderItems].filter((element) => element !== null),
      1.5,
      {
        x: 100,
        autoAlpha: 0,
        ease: Expo.easeOut,
      },
      0.4,
    );

    if (carouselControls) {
      TweenMax.from(carouselControls, 0.5, {
        opacity: 0,
        ease: eases.VinnieInOut,
      });
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C116DynamicCarousel,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C116DynamicCarousel,
    id: string,
  ): void {}
}

export default C116DynamicCarouselTransitionController;
