import { TweenMax } from 'gsap';
import lerp from 'lerp';
import AbstractTransitionComponent from '../../AbstractTransitionComponent';
import type O01Video from '../../organism/o01-video/O01Video.lazy';
import M03StickyMediaTransitionController from './M03StickyMediaTransitionController';

import './m03-sticky-media.scss';

export default class M03StickyMedia extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm03-sticky-media';

  public readonly transitionController: M03StickyMediaTransitionController;

  public enterViewThreshold = 0;

  private readonly backgroundElement = this.getElement('[data-sticky-background]');
  private readonly video = this.getComponent<O01Video>('o01-video');

  private inView: boolean = false;

  private scrollRaf = 0;
  private currentYTranslation = 0;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new M03StickyMediaTransitionController(this);
  }

  public async adopted() {
    this.tick();
  }

  public enterView(): void {
    this.inView = true;
    if (this.video) {
      this.video.player.play();
    }
    super.enterView();
  }

  public leaveView(): void {
    this.inView = false;
    if (this.video) {
      this.video.player.pause();
    }
    super.leaveView();
  }

  private tick(): void {
    if (!this.inView) {
      requestAnimationFrame(this.tick.bind(this));
      return;
    }

    if (this.backgroundElement) {
      const { offsetHeight: wrapperHeight, offsetTop: parentTop } = this.element
        .parentNode as HTMLElement;
      const { offsetHeight: elementHeight } = this.backgroundElement;
      const top = parentTop - scrollY;
      const translation =
        top > 0 ? -top / 2 : Math.max(0, Math.min(wrapperHeight - elementHeight, top * -1));

      this.currentYTranslation = lerp(this.currentYTranslation, translation, 0.9);

      TweenMax.set(this.backgroundElement, {
        y: this.currentYTranslation,
      });

      this.scrollRaf = requestAnimationFrame(this.tick.bind(this));
    }
  }

  public dispose() {
    super.dispose();
    cancelAnimationFrame(this.scrollRaf);
  }
}
