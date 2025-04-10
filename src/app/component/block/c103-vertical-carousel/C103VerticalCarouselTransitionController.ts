import { isEditor } from 'app/util/aemEditorUtils';
import AbstractTransitionController from '../../AbstractTransitionController';
import C103VerticalCarousel from './C103VerticalCarousel.lazy';
import { Power1, TimelineMax } from 'gsap';

class C103VerticalCarouselTransitionController extends AbstractTransitionController<C103VerticalCarousel> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C103VerticalCarousel,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C103VerticalCarousel,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C103VerticalCarousel,
    id: string,
  ): void {
    if (!parent.scrollLabelIcon || isEditor()) return;
    timeline
      .to(parent.scrollLabelIcon, 1, {
        y: 5,
        ease: Power1.easeInOut,
      })
      .to(parent.scrollLabelIcon, 2, {
        y: 0,
        ease: Power1.easeInOut,
      });
  }
}

export default C103VerticalCarouselTransitionController;
