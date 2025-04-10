import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import debounce from 'lodash-es/debounce';
import M42OverlayBackgroundTransitionController from './M42OverlayBackgroundTransitionController';
import { hasComponentEnteredViewport } from 'app/util/enterViewportUtils';
import { TweenMax } from 'gsap';
import { isEditor } from 'app/util/aemEditorUtils';

export default class M42OverlayBackground extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm42-overlay-background';

  public readonly transitionController: M42OverlayBackgroundTransitionController;
  private backgroundImageDivs = this.getElements('[data-background-image-url]');
  private overlayWrapper = this.getElement('[data-overlay-wrapper]');
  private images = this.getElements('[data-image]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new M42OverlayBackgroundTransitionController(this);

    this.addDisposableEventListener(
      window,
      'scroll',
      debounce(() => this.loadBackgroundImages(), 250, { leading: true }),
    );

    this.loadBackgroundImages();
  }

  private loadBackgroundImages() {
    if (isEditor()) {
      return;
    }

    if (this.overlayWrapper) {
      if (hasComponentEnteredViewport(this.overlayWrapper)) {
        this.backgroundImageDivs.forEach(
          (backgroundImageDiv) =>
            (backgroundImageDiv.style.backgroundImage = `url(${backgroundImageDiv.dataset.backgroundImageUrl})`),
        );

        TweenMax.fromTo([...this.images], 400, { xPercent: 0 }, { xPercent: '-50' }).repeat(-1);

        this.disposables.dispose();
      }
    }
  }
}
