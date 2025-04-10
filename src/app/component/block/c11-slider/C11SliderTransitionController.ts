import AbstractTransitionController from '../../AbstractTransitionController';
import C11Slider from './C11Slider.lazy';
import { TimelineMax, Expo, TweenMax } from 'gsap';
import A04Eyebrow from '../../atom/a04-eyebrow/A04Eyebrow';
import A03Heading from '../../atom/a03-heading/A03Heading';
import A05Moustache from '../../atom/a05-moustache/A05Moustache';
import eases from '../../../animation/eases';

class C11SliderTransitionController extends AbstractTransitionController<C11Slider> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C11Slider, id: string): void {
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
    parent: C11Slider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C11Slider,
    id: string,
  ): void {}

  public static animateOnEnter(
    headerItems: Array<HTMLElement>,
    sorter: HTMLElement | null,
    sliderItems: NodeListOf<Element>,
    carouselControls: HTMLElement | null,
  ) {
    if (headerItems) {
      TweenMax.staggerFromTo(
        headerItems,
        0.5,
        {
          x: 100,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        0.4,
      );
    }

    if (sorter) {
      TweenMax.fromTo(
        sorter,
        0.2,
        {
          x: 100,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
      );
    }

    TweenMax.staggerFromTo(
      sliderItems,
      0.8,
      {
        x: 100,
        autoAlpha: 0,
      },
      {
        x: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
      },
      0.8,
    );

    if (carouselControls) {
      TweenMax.fromTo(
        carouselControls,
        0.5,
        { opacity: 0 },
        {
          opacity: 1,
          ease: eases.VinnieInOut,
        },
      );
    }
  }

  public static animateOnLeave(
    sliderItems: NodeListOf<Element>,
    carouselControls: HTMLElement | null,
  ) {
    if (carouselControls) {
      TweenMax.to(carouselControls, 0.5, {
        opacity: 0,
        ease: eases.VinnieInOut,
      });
    }

    TweenMax.staggerFromTo(
      sliderItems,
      0.2,
      {
        autoAlpha: 1,
      },
      {
        autoAlpha: 0,
        ease: eases.VinnieInOut,
      },
      0.2,
    );
  }

  public static animateAll(parent: HTMLElement, isOnView: boolean): void {
    const headerItems = [
      parent.querySelector(`[data-component="${A04Eyebrow.displayName}"]`),
      parent.querySelector(`[data-component="${A03Heading.displayName}"]`),
      parent.querySelector(`[data-component="${A05Moustache.displayName}"]`),
    ].filter((element) => element !== null) as Array<HTMLElement>;
    const sorter = parent.querySelector<HTMLElement>('[data-sorter]');
    const sliderItems = parent.querySelectorAll('[data-slider-item]') as NodeListOf<HTMLElement>;
    const carouselControls = parent.querySelector<HTMLElement>('[data-controls]');

    isOnView
      ? this.animateOnEnter(headerItems, sorter, sliderItems, carouselControls)
      : this.animateOnLeave(sliderItems, carouselControls);
  }
}

export default C11SliderTransitionController;
