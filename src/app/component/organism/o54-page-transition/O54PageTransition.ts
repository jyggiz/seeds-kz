import AbstractComponent from '../../AbstractComponent';
import eases from '../../../animation/eases';
import { TimelineMax } from 'gsap';
import { isRtl } from '../../../util/rtlUtils';

export default class O54PageTransition extends AbstractComponent {
  public static readonly displayName: string = 'o54-page-transition';

  constructor(el: HTMLElement) {
    super(el);
  }

  public transitionIn(): Promise<void> {
    return new Promise((resolve) => {
      const timeline = new TimelineMax({
        onComplete: resolve,
      });
      const boxes = this.getElements('[data-box]');
      const [box1, box2] = boxes;

      timeline.set(box1, {
        opacity: 0,
      });

      timeline.set('html', {
        background: 'var(--color-page-background)',
      });

      timeline.fromTo(
        box2,
        0.75,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          ease: eases.VinnieInOut,
        },
      );
    });
  }

  public transitionOut(): Promise<void> {
    return new Promise((resolve) => {
      const timeline = new TimelineMax({
        onComplete: resolve,
      });
      const boxes = this.getElements('[data-box]');
      const [box1, box2] = boxes;

      timeline.set(boxes, {
        [isRtl() ? 'right' : 'left']: 'initial',
        [isRtl() ? 'left' : 'right']: 0,
        autoAlpha: 1,
        width: 0,
      });

      timeline
        .fromTo(
          box1,
          0.75,
          {
            width: 0,
          },
          {
            width: '100%',
            ease: eases.VinnieInOut,
          },
        )
        .fromTo(
          box2,
          0.75,
          {
            width: 0,
            scale: 1,
          },
          {
            width: '100%',
            scale: 1.01,
            ease: eases.VinnieInOut,
          },
          '=-0.5',
        );
    });
  }
}
