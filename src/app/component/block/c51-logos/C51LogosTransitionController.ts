import AbstractTransitionController from '../../AbstractTransitionController';
import C51Logos from './C51Logos.lazy';
import { TimelineMax } from 'gsap';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';
import A01Image from '../../atom/a01-image/A01Image';
import eases from '../../../animation/eases';
import M34ComponentBackground from '../../molecule/m34-component-background/M34ComponentBackground';

class C51LogosTransitionController extends AbstractTransitionController<C51Logos> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C51Logos, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);
    const images = parent.getElements(`[data-component="${A01Image.displayName}"]`);
    const backgroundComponent = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );
    let logos = images;

    if (backgroundComponent) {
      timeline.add(this.getTimeline(backgroundComponent));
      const backgroundImage = parent.getElement(
        `[data-component="${A01Image.displayName}"]`,
        backgroundComponent,
      );

      logos = images.filter((image) => image !== backgroundImage);
    }

    title && timeline.add(this.getTimeline(title));

    if (logos) {
      timeline.staggerFromTo(
        logos,
        0.6,
        {
          y: 150,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
          clearProps: 'y,opacity,visibility',
          stagger: {
            amount: 0.6,
          },
        },
        0,
      );
    }
  }

  protected setupTransitionOutTimeline(timeline: TimelineMax, parent: C51Logos, id: string): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C51Logos,
    id: string,
  ): void {}
}

export default C51LogosTransitionController;
