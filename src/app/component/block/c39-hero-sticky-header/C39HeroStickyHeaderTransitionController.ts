import AbstractTransitionController from '../../AbstractTransitionController';
import C39HeroStickyHeader from './C39HeroStickyHeader';
import { TimelineMax, TweenLite } from 'gsap';
import { isEditor } from '../../../util/aemEditorUtils';
import A01Image from '../../atom/a01-image/A01Image';
import {
  SplitAnimationStart,
  splitWordAnimationVertical,
} from '../../../animation/splitTextAnimation';
import A03Heading from '../../atom/a03-heading/A03Heading';
import { SplitText } from '../../../vendor/gsap/SplitText';
import eases from '../../../animation/eases';
import M18Paragraph from '../../molecule/m18-paragraph/M18Paragraph';
import A02Icon from '../../atom/a02-icon/A02Icon';
import A19Video from 'app/component/atom/a19-video/A19Video';

class C39HeroStickyHeaderTransitionController extends AbstractTransitionController<C39HeroStickyHeader> {
  private paragraphTimelineIn: TimelineMax = new TimelineMax({ paused: true });
  private paragraphTransitionedIn: boolean = false;

  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C39HeroStickyHeader,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const isAemEditor = isEditor();
    if (isAemEditor) return;

    const counter = { x: 1 };
    const heroWrapper = <HTMLElement>parent.getElement('[data-hero-wrapper]');
    const image = parent.getElement(`[data-component="${A01Image.displayName}"]`);
    const headings = parent.getElements(`[data-component="${A03Heading.displayName}"]`);
    const backgroundVideo = parent.getElement(`[data-component="${A19Video.displayName}"]`);
    let splitHeading = null;

    if (image) {
      timeline.add(this.getTimeline(image));
    }

    timeline.fromTo(
      counter,
      0.85,
      {
        x: 1,
      },
      {
        x: 0,
        ease: eases.VinnieInOut,
        onUpdate: () => {
          const { innerHeight } = window;
          const offsetHeight = heroWrapper.offsetHeight;
          TweenLite.set(image, { y: (innerHeight - offsetHeight) * counter.x });
        },
        onComplete: () => {
          TweenLite.set(image, { clearProps: 'y' });
        },
      },
      0.15,
    );

    if (backgroundVideo) {
      timeline.fromTo(
        backgroundVideo,
        1,
        { autoAlpha: 0, display: 'none' },
        { autoAlpha: 1, display: 'block' },
      );
    }

    if (headings) {
      headings.forEach((element) => {
        splitHeading = new SplitText(element, { type: 'lines,words' });
        timeline.add(splitWordAnimationVertical(splitHeading, SplitAnimationStart.CENTER), 0.5);
      });
    }

    this.addSlideInElements(parent.getElements('[data-hero-button]'), timeline);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C39HeroStickyHeader,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C39HeroStickyHeader,
    id: string,
  ): void {}

  public setupParagraphTimeline(parent: C39HeroStickyHeader) {
    const paragraph = <HTMLElement>(
      parent.getElement(`[data-component="${M18Paragraph.displayName}"]`)
    );
    const icon = parent.getElement(`[data-component="${A02Icon.displayName}"]`, paragraph);
    const copy = parent.getElement('.m-paragraph__content', paragraph);

    this.addSlideInElements([icon, copy], this.paragraphTimelineIn);
  }

  public paragraphTransitionIn() {
    if (this.paragraphTransitionedIn) {
      return;
    }

    this.paragraphTimelineIn.play(0);
    this.paragraphTransitionedIn = true;
  }
}

export default C39HeroStickyHeaderTransitionController;
