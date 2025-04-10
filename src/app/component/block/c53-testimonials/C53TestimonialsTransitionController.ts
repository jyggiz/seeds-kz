import eases from 'app/animation/eases';
import M34ComponentBackground from 'app/component/molecule/m34-component-background/M34ComponentBackground';
import { TimelineMax } from 'gsap';
import AbstractTransitionController from '../../AbstractTransitionController';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import C53Testimonials from './C53Testimonials.lazy';

class C53TestimonialsTransitionController extends AbstractTransitionController<C53Testimonials> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C53Testimonials,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const background = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );
    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    const logos = parent.getElements('[data-logo-item]');

    background && timeline.add(this.getTimeline(background));
    title && timeline.add(this.getTimeline(title));

    timeline.staggerFromTo(
      logos.filter((element) => element !== null),
      0.8,
      {
        y: 50,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        ease: eases.VinnieInOut,
        stagger: {
          amount: 0.4,
        },
      },
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C53Testimonials,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C53Testimonials,
    id: string,
  ): void {}
}

export default C53TestimonialsTransitionController;
