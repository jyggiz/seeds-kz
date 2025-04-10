import AbstractTransitionController from '../../AbstractTransitionController';
import C58HighlightSlideshow from './C58HighlightSlideshow.lazy';
import { TimelineMax, TweenMax, Linear } from 'gsap';
import { SlideTransitionOptions } from './C58HighlightSlideshow.types';

class C58HighlightSlideshowTransitionController extends AbstractTransitionController<C58HighlightSlideshow> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C58HighlightSlideshow,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    timeline.from(parent.element, 0.2, {
      autoAlpha: 0,
      onComplete: () => parent.startAutoPlay(),
    });
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C58HighlightSlideshow,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C58HighlightSlideshow,
    id: string,
  ): void {}

  public toggleSlide({
    slide,
    isShown,
    image,
    autoAlphaDuration,
    scaleDuration,
    disabledScaleAnimation,
  }: SlideTransitionOptions): void {
    TweenMax.to(slide, autoAlphaDuration, {
      autoAlpha: isShown ? 1 : 0,
      ease: Linear.easeOut,
    });

    if (isShown && !disabledScaleAnimation) {
      TweenMax.fromTo(
        image,
        scaleDuration * 2,
        { scale: 1 },
        {
          scale: 1.1,
        },
      );
    }
  }
}

export default C58HighlightSlideshowTransitionController;
