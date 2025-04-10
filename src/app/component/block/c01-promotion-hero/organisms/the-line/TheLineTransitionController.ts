import { TimelineMax } from 'gsap';
import TheLine from './TheLine';
import AbstractTransitionController from '../../../../AbstractTransitionController';
import { isEditor } from '../../../../../util/aemEditorUtils';
import { slideFadeIn } from '../../../../../animation/slideFadeIn';
import eases from '../../../../../animation/eases';
import { isRtl } from '../../../../../util/rtlUtils';

class TheLineTransitionController extends AbstractTransitionController<TheLine> {
  /**
   * Use this method to setup your transition in timeline
   *
   * @protected
   * @method setupTransitionInTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */

  protected setupTransitionInTimeline(timeline: TimelineMax, parent: TheLine, id: string): void {
    const isAemEditor = isEditor();
    if (isAemEditor) return;

    super.setupTransitionInTimeline(timeline, parent, id);

    const { logo, moustache, buttons, element } = parent;

    if (logo) {
      const { width: logoWidth, height: logoHeight } = logo.getBoundingClientRect();
      const { y: elementY, width: elementWidth } = element.getBoundingClientRect();

      const scale = elementWidth / logoWidth;

      const transformProps = {
        scale,
        y: (2 * elementY + 2 * (logoHeight * scale) - window.innerHeight) / 2,
        transformOrigin: isRtl() ? 'right bottom' : 'left bottom',
      };

      timeline.set(logo, transformProps);

      timeline.fromTo(
        logo,
        0.85,
        {
          clipPath: isRtl()
            ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
            : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          ease: eases.VinnieInOut,
          clearProps: 'clipPath',
        },
      );

      timeline.fromTo(
        logo,
        1.33,
        transformProps,
        {
          scale: 1,
          y: 0,
          ease: eases.VinnieInOut,
          clearProps: 'y,scale',
        },
        '=+0.5',
      );
    }

    timeline.add(
      slideFadeIn([moustache, ...buttons].filter(Boolean) as ReadonlyArray<HTMLElement>, 0.85),
      '=-0.75',
    );
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
  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: TheLine, id: string): void {}

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
    parent: TheLine,
    id: string,
  ): void {}
}

export default TheLineTransitionController;
