import AbstractTransitionController from '../../AbstractTransitionController';
import O59ModalTestimonialContent from './O59ModalTestimonialContent.lazy';
import { TimelineMax } from 'gsap';

class O59ModalTestimonialContentTransitionController extends AbstractTransitionController<O59ModalTestimonialContent> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O59ModalTestimonialContent,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O59ModalTestimonialContent,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O59ModalTestimonialContent,
    id: string,
  ): void {}
}

export default O59ModalTestimonialContentTransitionController;
