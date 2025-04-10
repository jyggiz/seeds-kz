import { TweenMax } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import AbstractComponent from '../../AbstractComponent';
import eases from '../../../animation/eases';
import { getAnimationDuration } from '../../../util/getAnimationDuration';

export default class M10ScrollButton extends AbstractComponent {
  public static readonly displayName: string = 'm10-scroll-button';

  constructor(el: HTMLElement) {
    super(el);

    ScrollToPlugin;

    this.addDisposableEventListener(this.element, 'click', this.onScrollButtonClick.bind(this));
  }

  /**
   * Finds the parent block component and scrolls the window to the next block component
   *
   * WARNING: Calling this method without the presence of the second block component on the page will throw an error!
   *
   * */
  private onScrollButtonClick(): void {
    const parentBlockElement = this.element.closest('[data-component^="c"]');

    if (!parentBlockElement) {
      throw new Error('The parent block element cannot be found');
    }

    if (!parentBlockElement.nextElementSibling) {
      throw new Error('The next block element cannot be found');
    }

    TweenMax.to(window, getAnimationDuration(0.5), {
      scrollTo: parentBlockElement.nextElementSibling,
      ease: eases.VinnieInOut,
    });
  }

  /**
   * Hides/Shows an element with an opacity animation
   *
   * @param {boolean} isHidden - The boolean toggle visibility of the component (hide/show = true/false)
   * */
  public set elementHidden(isHidden: boolean) {
    TweenMax.to(this.element, getAnimationDuration(0.2), { autoAlpha: isHidden ? 0 : 1 });
  }
}
