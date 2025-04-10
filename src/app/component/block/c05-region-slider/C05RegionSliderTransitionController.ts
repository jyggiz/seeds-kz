import AbstractTransitionController from '../../AbstractTransitionController';
import C05RegionSlider from './C05RegionSlider.lazy';
import { TimelineMax } from 'gsap';
import M34ComponentBackground from '../../molecule/m34-component-background/M34ComponentBackground';
import A19Video from '../../atom/a19-video/A19Video';
import O71RegionSliderNavigation from '../../organism/o71-region-slider-navigation/O71RegionSliderNavigation.lazy';

class C05RegionSliderTransitionController extends AbstractTransitionController<C05RegionSlider> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C05RegionSlider,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const background = parent.getElement(
      `[data-component="${M34ComponentBackground.displayName}"]`,
    );

    const regionSlider = parent.getElement(
      `[data-component="${O71RegionSliderNavigation.displayName}"]`,
    );

    const video = parent.getElement(`[data-component="${A19Video.displayName}"]`);
    if (video) {
      timeline.set(video, { autoAlpha: 1, display: 'block' });
    } else {
      background && timeline.add(this.getTimeline(background), 0);
    }

    regionSlider && timeline.add(this.getTimeline(regionSlider), 0);
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C05RegionSlider,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C05RegionSlider,
    id: string,
  ): void {}
}

export default C05RegionSliderTransitionController;
