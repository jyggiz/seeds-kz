import AbstractTransitionController from '../../AbstractTransitionController';
import C71FactsList from './C71FactsList.lazy';
import { TimelineMax } from 'gsap';

class C71FactsListTransitionController extends AbstractTransitionController<C71FactsList> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C71FactsList,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  public scaleImage(image: HTMLElement, duration: number): void {
    const timeline = new TimelineMax();
    timeline.fromTo(
      image,
      duration,
      {
        scale: 1,
      },
      {
        scale: 1.025,
      },
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C71FactsList,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C71FactsList,
    id: string,
  ): void {}
}

export default C71FactsListTransitionController;
