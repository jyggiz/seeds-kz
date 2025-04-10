import AbstractTransitionController from '../../AbstractTransitionController';
import C42NavigationTiles from './C42NavigationTiles';
import { TimelineMax } from 'gsap';
import M25TileButton from 'app/component/molecule/m25-tile-button/M25TileButton';

class C42NavigationTilesTransitionController extends AbstractTransitionController<C42NavigationTiles> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: C42NavigationTiles,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const titleButtons = parent.getElements(`[data-component="${M25TileButton.displayName}"]`);

    if (titleButtons) {
      timeline.from(titleButtons[0], 0.3, {
        x: -50,
        autoAlpha: 0,
      });
      timeline.from(titleButtons[1], 0.3, {
        x: 50,
        autoAlpha: 0,
      });
    }
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: C42NavigationTiles,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: C42NavigationTiles,
    id: string,
  ): void {}
}

export default C42NavigationTilesTransitionController;
