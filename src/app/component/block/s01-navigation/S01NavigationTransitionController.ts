import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import S01Navigation from './S01Navigation';

class S01NavigationTransitionController extends AbstractTransitionController {
  /**
   * Use this method to setup your transition in timeline
   *
   * @protected
   * @method setupTransitionInTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: S01Navigation,
    id: string,
  ): void {
    timeline
      .to(parent.element, 0, { display: 'block' })
      .fromTo(parent.element, 0.1, { opacity: 0 }, { opacity: 1 });
  }

  /**
   * Use this method to setup your transition out timeline
   *
   * @protected
   * @method setupTransitionOutTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IMubanTransitionMixin} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: S01Navigation,
    id: string,
  ): void {
    timeline.to(parent.element, 0.6, { opacity: 0 });
  }

  /**
   * Use this method to setup your looping timeline
   *
   * @protected
   * @method setupLoopingAnimationTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IMubanTransitionMixin} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: S01Navigation,
    id: string,
  ): void {}
}

export default S01NavigationTransitionController;
