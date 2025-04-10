import AbstractTransitionController from '../../AbstractTransitionController';
import C54CountdownTimer from './C54CountdownTimer.lazy';
import { TimelineMax } from 'gsap';
import M34ComponentBackground from 'app/component/molecule/m34-component-background/M34ComponentBackground';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';

class C54CountdownTimerTransitionController extends AbstractTransitionController<C54CountdownTimer> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C54CountdownTimer,
    id: string,
  ): void {
    const background = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );
    const heading = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);

    background && timeline.add(this.getTimeline(background));
    heading && timeline.add(this.getTimeline(heading));
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C54CountdownTimer,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C54CountdownTimer,
    id: string,
  ): void {}
}

export default C54CountdownTimerTransitionController;
