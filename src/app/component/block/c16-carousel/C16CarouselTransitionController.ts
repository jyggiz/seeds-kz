import AbstractTransitionController from '../../AbstractTransitionController';
import C16Carousel from './C16Carousel.lazy';
import { TimelineMax, Linear } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import eases from '../../../animation/eases';
import O19UpdateCard from 'app/component/organism/o19-update-card/O19UpdateCard.lazy';

class C16CarouselTransitionController extends AbstractTransitionController<C16Carousel> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C16Carousel,
    id: string,
  ): void {
    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    const sliderItems = parent.getElements(`[data-component="${O19UpdateCard.displayName}"]`);
    const carouselControls = parent.getElement('[data-controls]');

    if (title) {
      timeline.add(this.getTimeline(title));
    }

    timeline.staggerFromTo(
      sliderItems.filter((element) => element !== null),
      0.8,
      {
        x: 100,
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
    );

    if (carouselControls) {
      timeline.from(
        carouselControls,
        0.5,
        {
          opacity: 0,
          ease: eases.VinnieInOut,
        },
        '-=0.4',
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C16Carousel,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C16Carousel,
    id: string,
  ): void {}
}

export default C16CarouselTransitionController;
