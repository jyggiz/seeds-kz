import AbstractTransitionController from '../../AbstractTransitionController';
import C67ScrollStories from './C67ScrollStories.lazy';
import { TimelineMax, TweenMax } from 'gsap';
import A04Eyebrow from '../../atom/a04-eyebrow/A04Eyebrow';
import A03Heading from '../../atom/a03-heading/A03Heading';
import { SplitText } from '../../../vendor/gsap/SplitText';
import {
  SplitAnimationStart,
  splitWordAnimationVertical,
} from '../../../animation/splitTextAnimation';
import eases from '../../../animation/eases';

class C67ScrollStoriesTransitionController extends AbstractTransitionController<C67ScrollStories> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C67ScrollStories,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C67ScrollStories,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C67ScrollStories,
    id: string,
  ): void {}

  public async setupItemTransitionInTimeline(element: HTMLElement): Promise<TimelineMax> {
    await document.fonts.ready;

    const timeline = new TimelineMax({ paused: true });

    const eyebrow = element.querySelector(`[data-component="${A04Eyebrow.displayName}"]`);
    const heading = element.querySelector(`[data-component="${A03Heading.displayName}"]`);
    const content = element.querySelectorAll('[data-paragraph-content] > *');

    if (eyebrow)
      timeline.fromTo(
        eyebrow,
        0.8,
        {
          autoAlpha: 0,
          y: 50,
        },
        {
          autoAlpha: 1,
          y: 0,
          ease: eases.VinnieInOut,
        },
      );

    if (heading) {
      const headingSplit = new SplitText(heading, { type: 'words|lines' });

      if (headingSplit)
        timeline.add(splitWordAnimationVertical(headingSplit, SplitAnimationStart.LEFT), '=-0.4');
    }

    if (content.length > 0)
      timeline.fromTo(
        content,
        0.8,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
        '=-0.4',
      );

    return timeline;
  }

  public static tweenImage(
    progress: number,
    index: number,
    image: HTMLElement,
    itemWrapper: HTMLElement,
  ): void {
    if (index === 0) {
      TweenMax.set(itemWrapper, {
        autoAlpha: 1,
      });
    } else if (progress < 0.25 && progress > 0) {
      const imageProgress = progress * 4;
      TweenMax.set(itemWrapper, {
        autoAlpha: imageProgress,
      });
      TweenMax.set(image, {
        scale: ((imageProgress - 1) * -1) / 10 + 1,
      });
    } else if (progress >= 0.25) {
      TweenMax.set(itemWrapper, {
        autoAlpha: 1,
      });
      TweenMax.set(image, {
        scale: 1,
      });
    } else if (progress <= 0) {
      TweenMax.set(itemWrapper, {
        autoAlpha: 0,
      });
    }
  }

  public static tweenContent(
    progress: number,
    timeline: TimelineMax,
    index: number,
    contentWrapper: HTMLElement,
  ): void {
    if (progress < 0.25 && progress > 0) {
      TweenMax.to(contentWrapper, 0.3, {
        autoAlpha: 0,
        clearProps: 'all',
        onComplete: () => timeline.pause(0),
      });
    } else if (progress < 0.9 && progress > 0.25) {
      if (!timeline.isActive() && timeline.progress() === 0) timeline.play(0);
    } else if (progress > 1) {
      TweenMax.to(contentWrapper, 0.3, {
        autoAlpha: 0,
        clearProps: 'all',
        onComplete: () => timeline.pause(0),
      });
    }
  }
}

export default C67ScrollStoriesTransitionController;
