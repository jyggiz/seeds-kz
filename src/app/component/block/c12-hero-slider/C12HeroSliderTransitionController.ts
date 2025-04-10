import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import AbstractTransitionController from '../../AbstractTransitionController';
import C12HeroSlider from './C12HeroSlider';
import { isEditor } from '../../../util/aemEditorUtils';

class C12HeroSliderTransitionController extends AbstractTransitionController<C12HeroSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C12HeroSlider,
    id: string,
  ): void {
    const isAemEditor = isEditor();
    if (isAemEditor) return;

    super.setupTransitionInTimeline(timeline, parent, id);
    const carouselControls = parent.getElement('[data-controls]');
    const sliderItems = parent.getElements('[data-slide]');

    if (sliderItems.length === 0) return;

    const firstSlide = <HTMLElement>sliderItems[0].firstElementChild;

    if (parent.isMobile) {
      timeline.staggerFromTo(
        sliderItems.filter((element) => element !== null),
        0.4,
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
    }

    timeline.add(this.getTimeline(firstSlide));

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
    parent: C12HeroSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C12HeroSlider,
    id: string,
  ): void {}
}

export default C12HeroSliderTransitionController;
