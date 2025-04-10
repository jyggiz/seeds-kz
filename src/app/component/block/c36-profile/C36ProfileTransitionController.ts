import AbstractTransitionController from '../../AbstractTransitionController';
import C36Profile from './C36Profile.lazy';
import { TimelineMax } from 'gsap';
import eases from '../../../animation/eases';
import ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';

class C36ProfileTransitionController extends AbstractTransitionController<C36Profile> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C36Profile, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const heading = parent.getElement(`[data-component="${ComponentHeader.displayName}"]`);
    const sectorImage = parent.getElement('[data-sector-image]');
    const profilePeople = parent.getElements('[data-profile-person]');
    const profileControls = parent.getElement('[data-controls]');

    if (heading) {
      timeline.to(
        heading,
        0.8,
        {
          opacity: 1,
          y: 0,
          ease: eases.VinnieInOut,
        },
        '0',
      );
    }

    if (sectorImage) {
      timeline.from(
        sectorImage,
        0.5,
        {
          opacity: 0,
          scale: 0.7,
          ease: eases.VinnieInOut,
        },
        '0.2',
      );
    }

    if (profilePeople) {
      timeline.staggerFromTo(
        profilePeople.filter((person) => person !== null),
        0.5,
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
            amount: 0.3,
          },
        },
        0,
        '0.4',
      );
    }

    if (profileControls) {
      timeline.from(
        profileControls,
        0.5,
        {
          opacity: 0,
          ease: eases.VinnieInOut,
        },
        '0.4',
      );
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C36Profile,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C36Profile,
    id: string,
  ): void {}
}

export default C36ProfileTransitionController;
