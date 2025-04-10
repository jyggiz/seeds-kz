import AbstractTransitionController from '../../AbstractTransitionController';
import O47DownloadDrawer from './O47DownloadDrawer.lazyManual';
import { TimelineMax } from 'gsap';
import eases from 'app/animation/eases';

class O47DownloadDrawerTransitionController extends AbstractTransitionController<O47DownloadDrawer> {
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: O47DownloadDrawer,
    id: string,
  ): void {
    super.setupTransitionInTimeline(timeline, parent, id);

    const downloadDrawer = parent.getElement(`[data-download-drawer]`);

    downloadDrawer &&
      timeline.fromTo(
        downloadDrawer,
        0.4,
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
          ease: eases.VinnieInOut,
        },
      );
  }

  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: O47DownloadDrawer,
    id: string,
  ): void {}

  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: O47DownloadDrawer,
    id: string,
  ): void {}
}

export default O47DownloadDrawerTransitionController;
