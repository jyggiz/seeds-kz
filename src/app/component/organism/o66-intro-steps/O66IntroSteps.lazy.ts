import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { getAppComponent } from 'app/util/getElementComponent';
import O66IntroStepsTransitionController from './O66IntroStepsTransitionController';

import './o66-intro-steps.scss';

export default class O66IntroSteps extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o66-intro-steps';

  public readonly transitionController: O66IntroStepsTransitionController;

  private videoContainer: HTMLElement | null = null;
  private video: HTMLVideoElement | null = null;
  private isTransitionedIn: boolean = false;
  private isIntroAVideo: boolean = false;
  private isTransitionSetup: boolean = false;

  private animationFrameReference = 0;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O66IntroStepsTransitionController(this);
  }

  public onTransitionIsSetup() {
    this.isTransitionSetup = true;
  }

  public async adopted(): Promise<void> {
    this.videoContainer = this.element.querySelector('[data-region-hotspots-video-container]');

    this.isIntroAVideo = !!this.videoContainer;

    if (this.isIntroAVideo) {
      this.video = this.videoContainer && this.videoContainer.querySelector('[data-video]');
      // Pausing the video immediately after the component is
      // loaded is a workaround for iPhone devices. If the
      // 'playsinline' attribute is not set in the video element (along with 'muted'),
      // iPhones deny video playback when this.video.play() is fired.
      // However, playsinline does not preload the video (preload is not respected either),
      // causing the video to start from a blank white background when play() fires.
      // As a workaround we set autoplay to true, pause the video on component load,
      // and play video once again once user scrolls past specified threshold.
      this.video && this.video.pause();
    }

    this.tick();
  }

  private async onVideoIntroExists(): Promise<void> {
    if (!this.video) {
      return Promise.resolve();
    }

    try {
      // Video element must have "muted" attribute for play() to work on
      // all devides other than iPhones. For iPhones playsinline attribute
      // must be also present for play() to fire.
      await this.video.play();
    } catch (err) {
      return Promise.resolve();
    }
  }

  private async tick(): Promise<void> {
    if (this.isTransitionedIn) {
      return;
    }

    const onTransitionIsClearToPlay = async (): Promise<void> => {
      this.isTransitionedIn = true;
      await this.transitionIn();
    };

    // Wait for application to be loaded so that all components above o66 have been
    // painted. Otherwise there is the risk of getting a wrong bounding.bottom /bounding.top
    // value for o66, and the intro would start playing prematurely.
    if (!window.location.href.includes('viewMode=story')) {
      await getAppComponent();
    }

    const bounding = this.element.getBoundingClientRect();

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Check if component is larger than viewport and if so,
    // start playback when top of component aligns with top of viewport.
    // Otherwise start playback when bottom of component enters viewport.
    const playbackCondition =
      this.element.offsetHeight >= window.innerHeight
        ? bounding.top <= 0
        : Math.floor(bounding.bottom) <= windowHeight;
    // window.innerHeight returns an integer, so in case component is last on page we need to floor bounding.bottom

    if (playbackCondition && this.isTransitionSetup) {
      this.isIntroAVideo
        ? this.onVideoIntroExists().then(onTransitionIsClearToPlay)
        : onTransitionIsClearToPlay();
    }

    this.animationFrameReference = requestAnimationFrame(this.tick.bind(this));
  }

  public dispose() {
    super.dispose();

    cancelAnimationFrame(this.animationFrameReference);
  }
}
