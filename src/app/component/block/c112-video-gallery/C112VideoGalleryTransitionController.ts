import AbstractTransitionController from '../../AbstractTransitionController';
import C112VideoGallery from './C112VideoGallery.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import O32GalleryCard from '../../organism/o32-gallery-card/O32GalleryCard.lazy';

class C112VideoGalleryTransitionController extends AbstractTransitionController<C112VideoGallery> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C112VideoGallery,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    const cards = parent.getElements(`[data-component="${O32GalleryCard.displayName}"]`);

    if (title) {
      timeline.add(this.getTimeline(title));
    }

    timeline.staggerFromTo(
      cards.filter((element) => element !== null),
      0.6,
      {
        y: 150,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.8,
        },
      },
      0,
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C112VideoGallery,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C112VideoGallery,
    id: string,
  ): void {}
}

export default C112VideoGalleryTransitionController;
