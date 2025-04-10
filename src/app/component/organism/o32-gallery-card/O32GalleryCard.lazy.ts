import { TweenMax } from 'gsap';
import { getComponentForElement } from 'muban-core';

import AbstractComponent from 'app/component/AbstractComponent';
import M02Button from 'app/component/molecule/m02-button/M02Button';

import './o32-gallery-card.scss';

export default class O32GalleryCard extends AbstractComponent {
  public static readonly displayName: string = 'o32-gallery-card';

  private readonly playButton = this.getElement<HTMLButtonElement>('[data-play-button]');

  constructor(el: HTMLElement) {
    super(el);

    const playButton = this.getElement<HTMLButtonElement>('[data-play-button] button');
    const image = this.element.getElementsByTagName('img')[0];

    if (playButton) {
      this.addDisposableEventListener(playButton, 'mouseenter', () => {
        this.scaleUpSlideElements(playButton, image);
      });

      this.addDisposableEventListener(playButton, 'mouseleave', () => {
        this.scaleDownSlideElements(playButton, image);
      });
    }
  }

  private scaleUpSlideElements(playButton: HTMLButtonElement, image: HTMLImageElement) {
    TweenMax.to(playButton, 0.5, { css: { scaleX: 1.1, scaleY: 1.1 } });

    if (image) {
      TweenMax.to(image, 0.5, { css: { scaleX: 1.1, scaleY: 1.1 } });
    }
  }

  private scaleDownSlideElements(playButton: HTMLButtonElement, image: HTMLImageElement) {
    TweenMax.to(playButton, 0.5, { css: { scaleX: 1, scaleY: 1 } });

    if (image) {
      TweenMax.to(image, 0.5, { css: { scaleX: 1, scaleY: 1 } });
    }
  }

  public disablePlayButton(): void {
    if (!this.playButton) {
      return;
    }

    const playButton = getComponentForElement<M02Button>(this.playButton);
    playButton.allowVideoModal = false;
  }
}
