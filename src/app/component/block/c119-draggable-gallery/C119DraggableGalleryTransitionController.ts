import AbstractTransitionController from 'app/component/AbstractTransitionController';
import C119DraggableGallery from './C119DraggableGallery.lazy';
import { TimelineMax } from 'gsap';

class C119DraggableGalleryTransitionController extends AbstractTransitionController<C119DraggableGallery> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C119DraggableGallery,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C119DraggableGallery,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C119DraggableGallery,
    id: string,
  ): void {}
}

export default C119DraggableGalleryTransitionController;
