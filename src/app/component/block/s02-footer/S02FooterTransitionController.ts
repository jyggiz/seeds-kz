import { TimelineMax } from 'gsap';
import S02Footer from './S02Footer';
import AbstractTransitionController from '../../AbstractTransitionController';
import eases from '../../../animation/eases';

class S02FooterTransitionController extends AbstractTransitionController<S02Footer> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: S02Footer, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const sitemapItems = parent.getElements('[data-sitemap-item]');
    const socialItems = parent.getElements('[data-social-item]');
    const marginalia = parent.getElement('[data-marginalia]');

    const elements = [...sitemapItems, ...socialItems, marginalia];

    if (elements && sitemapItems.length > 0) {
      timeline.staggerFromTo(
        elements,
        0.6,
        {
          x: 100,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          clearProps: 'x,opacity,visibility',
          ease: eases.VinnieInOut,
          stagger: {
            amount: 0.6,
          },
        },
        0,
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: S02Footer,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: S02Footer,
    id: string,
  ): void {}
}

export default S02FooterTransitionController;
