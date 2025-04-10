import { TimelineMax } from 'gsap';
import C01PromotionHero from './C01PromotionHero';
import AbstractTransitionController from '../../AbstractTransitionController';
import { isEditor } from '../../../util/aemEditorUtils';
import M34ComponentBackground from '../../molecule/m34-component-background/M34ComponentBackground';

class C01PromotionHeroTransitionController extends AbstractTransitionController {
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
    parent: C01PromotionHero,
    id: string,
  ): void {
    const isAemEditor = isEditor();
    if (isAemEditor) return;

    super.setupTransitionInTimeline(timeline, parent, id);

    const promotion = parent.getElement(`[data-component="${parent.promotionID}"]`);
    if (promotion) timeline.add(this.getTimeline(promotion));

    const background = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );
    if (background) timeline.add(this.getTimeline(background), '=-1.7');
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
    parent: C01PromotionHero,
    id: string,
  ): void {}

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
    parent: C01PromotionHero,
    id: string,
  ): void {}
}

export default C01PromotionHeroTransitionController;
