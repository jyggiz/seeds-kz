import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { getAppComponent } from '../../../util/getElementComponent';
import { TweenMax } from 'gsap';
import App from '../../layout/app/App';
import M02Button from 'app/component/molecule/m02-button/M02Button';
import A01Image from 'app/component/atom/a01-image/A01Image';

import './o18-story-card.scss';

export default class O18StoryCard extends AbstractTransitionBlock {
  public static readonly displayName: string = 'o18-story-card';
  private readonly playButton: HTMLButtonElement | null = this.getElement(
    `[data-component="${M02Button.displayName}"]`,
  );
  private readonly A01Image: HTMLElement | null = this.getElement(
    `[data-component="${A01Image.displayName}"]`,
  );
  private readonly storyImage: HTMLImageElement | null =
    this.A01Image && this.getElement('[data-image-img]', this.A01Image);

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    if (this.element.hasAttribute('data-video')) {
      if (this.storyImage) {
        this.storyImage.style.cursor = 'pointer';
      }
    }

    if (this.playButton) {
      this.addDisposableEventListener(this.playButton, 'mouseenter', () => {
        if (this.playButton && this.storyImage) {
          this.scaleUpSlideElements(this.playButton, this.storyImage);
        }
      });
      this.addDisposableEventListener(this.playButton, 'mouseleave', () => {
        if (this.playButton && this.storyImage) {
          this.scaleDownSlideElements(this.playButton, this.storyImage);
        }
      });
    }
  }

  public async adopted() {
    if (!window.location.href.includes('viewMode=story')) {
      this.app = await getAppComponent();
    }
  }

  private scaleUpSlideElements(playButton: HTMLButtonElement, image: HTMLImageElement) {
    TweenMax.to(playButton, 0.5, { css: { scaleX: 1.1, scaleY: 1.1 } });
    TweenMax.to(image, 0.5, { css: { scaleX: 1.1, scaleY: 1.1 } });
  }

  private scaleDownSlideElements(playButton: HTMLButtonElement, image: HTMLImageElement) {
    TweenMax.to(playButton, 0.5, { css: { scaleX: 1, scaleY: 1 } });
    TweenMax.to(image, 0.5, { css: { scaleX: 1, scaleY: 1 } });
  }

  public dispose() {
    super.dispose();
  }
}
