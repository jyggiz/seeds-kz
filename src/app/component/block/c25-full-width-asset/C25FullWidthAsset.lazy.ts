import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C25FullWidthAssetTransitionController from './C25FullWidthAssetTransitionController';
import O03VideoPlayer from '../../organism/o03-video-player/O03VideoPlayer.lazy';
import App from '../../layout/app/App';
import VideoEvent from '../../organism/o01-video/event/VideoEvent';
import { getAppComponent } from '../../../util/getElementComponent';
import { TweenMax } from 'gsap';
import { openSharePopup } from 'app/util/OpenSharePopup';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c25-full-width-asset.scss';

export default class C25FullWidthAsset extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c25-full-width-asset';

  public readonly transitionController: C25FullWidthAssetTransitionController;

  private readonly closeButton = this.element.querySelector('[data-close-button]');
  private readonly shareButton = this.getElement('[data-share-button]');
  private readonly video = this.getComponent<O03VideoPlayer>(O03VideoPlayer.displayName);
  private readonly contentContainer = this.element.querySelector('[data-content-container]');
  private app: App | null = null;
  private isAndroid: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C25FullWidthAssetTransitionController(this);

    this.addEventListeners();

    if (navigator.userAgent.match(/Android/i)) this.isAndroid = true;
    if (this.isAndroid) this.setElementHeight();
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.closeButton &&
      this.addDisposableEventListener(this.closeButton, 'click', this.onCloseClick.bind(this));

    this.video &&
      this.video.addDisposableEventListener(
        this.video.dispatcher,
        VideoEvent.PLAYING,
        this.handleVideoPlaying.bind(this),
      );

    this.video &&
      this.video.addDisposableEventListener(
        this.video.dispatcher,
        VideoEvent.ENDED,
        this.handleVideoEnd.bind(this),
      );

    this.shareButton &&
      this.addDisposableEventListener(this.shareButton, 'click', () =>
        openSharePopup(this.shareButton),
      );

    this.addDisposableEventListener(window, 'resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    if (this.isAndroid) this.setElementHeight();
  }

  private async handleVideoPlaying() {
    this.setContentVisibility(false);

    if (this.app) {
      await this.app.setElementHidden(true);
    }
  }

  private async onCloseClick() {
    this.video && this.video.close();

    if (this.app) {
      await this.app.setElementHidden(false);
    }
    this.setContentVisibility(true);
  }

  private async handleVideoEnd(event: VideoEvent) {
    this.video && this.video.close();

    if (this.app) {
      await this.app.setElementHidden(false);
    }
    this.setContentVisibility(true);

    this.dispatcher.dispatchEvent(event);
  }

  private setElementHeight(): void {
    this.element.style.minHeight = 'unset';
    const screenHeight = window.screen.height;
    TweenMax.set(this.element, { height: screenHeight });
  }

  private setContentVisibility(isVisible: boolean): void {
    if (this.closeButton !== null) {
      TweenMax.to(this.closeButton, 0.2, { autoAlpha: isVisible ? 0 : 1 });
    }

    this.contentContainer &&
      TweenMax.to(this.contentContainer, 0.2, { autoAlpha: isVisible ? 1 : 0 });
  }
}
