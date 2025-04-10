import AbstractTransitionController from '../../AbstractTransitionController';
import C33GroupedContentSlider from './C33GroupedContentSlider.lazy';
import { TimelineMax } from 'gsap';
import M34ComponentBackground from '../../molecule/m34-component-background/M34ComponentBackground';
import M04ComponentHeader from '../../molecule/m04-component-header/M04ComponentHeader';

class C33GroupedContentSliderTransitionController extends AbstractTransitionController<C33GroupedContentSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C33GroupedContentSlider,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const background = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );
    const title = parent.getElement(`[data-component="${M04ComponentHeader.displayName}"]`);

    background && timeline.add(this.getTimeline(background));
    title && timeline.add(this.getTimeline(title));
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C33GroupedContentSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C33GroupedContentSlider,
    id: string,
  ): void {}
}

export default C33GroupedContentSliderTransitionController;
