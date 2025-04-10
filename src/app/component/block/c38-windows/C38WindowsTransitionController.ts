import AbstractTransitionController from '../../AbstractTransitionController';
import C38Windows from './C38Windows.lazy';
import { TimelineMax } from 'gsap';
import { SplitText } from '../../../vendor/gsap/SplitText';
import O33Window from 'app/component/organism/o33-window/O33Window.lazy';
import A04Eyebrow from 'app/component/atom/a04-eyebrow/A04Eyebrow';
import M34ComponentBackground from '../../molecule/m34-component-background/M34ComponentBackground';
import {
  SplitAnimationStart,
  splitWordAnimationVertical,
} from '../../../animation/splitTextAnimation';

class C38WindowsTransitionController extends AbstractTransitionController<C38Windows> {
  protected setupTransitionInTimeline(timeline: TimelineMax, parent: C38Windows, id: string): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const heading = parent.getElement(`[data-component="${A04Eyebrow.displayName}"]`);
    const windows = parent.getElements(`[data-component="${O33Window.displayName}"]`);
    const background = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );

    background && timeline.add(this.getTimeline(background));

    if (heading) {
      const splitTitle = new SplitText(heading, { type: 'lines,words' });
      timeline.add(splitWordAnimationVertical(splitTitle, 'left' as SplitAnimationStart), 0);
    }

    timeline.staggerFromTo(
      windows.filter((element) => element !== null),
      0.6,
      {
        y: 200,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        clearProps: 'y,opacity,visibility',
        stagger: {
          amount: 0.5,
        },
      },
      0,
    );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C38Windows,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C38Windows,
    id: string,
  ): void {}
}

export default C38WindowsTransitionController;
