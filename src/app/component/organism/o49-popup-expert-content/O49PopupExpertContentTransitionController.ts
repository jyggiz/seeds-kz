import AbstractTransitionController from '../../AbstractTransitionController';
import O49PopupExpertContent from './O49PopupExpertContent';
import { TimelineMax, Linear } from 'gsap';
import eases from 'app/animation/eases';

class O49PopupExpertContentTransitionController extends AbstractTransitionController<O49PopupExpertContent> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O49PopupExpertContent,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  public animateIn(cardInformation: any, isMobile: boolean) {
    const timeline = new TimelineMax();
    const expertPopup = this.parentController.getElement('[data-expert-popup]');
    const expertPopupContent = this.parentController.getElements('[data-expert-popup-copy]');

    if (expertPopup) {
      timeline.fromTo(
        expertPopup,
        0.8,
        {
          x: isMobile ? 0 : cardInformation.x,
          y: cardInformation.y,
          width: cardInformation.width,
          height: cardInformation.height,
        },
        {
          width: isMobile ? '100%' : 400,
          height: isMobile ? window.innerHeight - 50 : 640,
          x: isMobile ? 0 : cardInformation.x,
          y: isMobile ? 0 : window.innerHeight / 2,
          xPercent: isMobile ? 0 : -12,
          yPercent: isMobile ? 0 : -50,
          transformOrigin: 'center',
          ease: eases.VinnieInOut,
        },
      );
    }

    if (expertPopupContent) {
      timeline.staggerFromTo(
        expertPopupContent.filter((copy) => copy !== null),
        0.4,
        {
          y: 50,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
          stagger: {
            amount: 0.1,
          },
        },
        0,
        '-=0.15',
      );
    }
  }

  public async animateOut(cardInformation: any, isMobile: boolean) {
    const timeline = new TimelineMax();
    const expertPopup = this.parentController.getElement('[data-expert-popup]');
    const expertPopupContent = this.parentController.getElements('[data-expert-popup-copy]');

    if (expertPopup) {
      timeline.fromTo(
        expertPopup,
        0.55,
        {
          width: isMobile ? '100%' : 400,
          height: isMobile ? window.innerHeight - 50 : 640,
          x: isMobile ? 0 : cardInformation.x,
          y: isMobile ? 0 : window.innerHeight / 2,
          xPercent: isMobile ? 0 : -12,
          yPercent: isMobile ? 0 : -50,
        },
        {
          x: isMobile ? 0 : cardInformation.x,
          y: cardInformation.y,
          width: cardInformation.width,
          height: cardInformation.height,
          xPercent: 0,
          yPercent: 0,
          transformOrigin: 'center',
          ease: eases.VinnieInOut,
        },
        '0',
      );
    }

    if (expertPopupContent) {
      timeline.from(expertPopupContent, 0.1, {
        autoAlpha: 0,
        ease: eases.VinnieInOut,
        clearProps: 'y,opacity,visibility',
      });
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O49PopupExpertContent,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O49PopupExpertContent,
    id: string,
  ): void {}
}

export default O49PopupExpertContentTransitionController;
