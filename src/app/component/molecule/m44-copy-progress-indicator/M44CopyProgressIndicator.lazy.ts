import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import A02Icon from 'app/component/atom/a02-icon/A02Icon';
import A07Label from 'app/component/atom/a07-label/A07Label';
import { TimelineMax } from 'gsap';
import M44CopyProgressIndicatorTransitionController from './M44CopyProgressIndicatorTransitionController';

import './m44-copy-progress-indicator.scss';

export default class M44CopyProgressIndicator extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm44-copy-progress-indicator';

  public readonly transitionController: M44CopyProgressIndicatorTransitionController;
  private progress = this.getElement(`[data-progress]`);
  private copiedLabel = this.getElement(`[data-copied-label]`);
  private label = this.getElement(`[data-component="${A07Label.displayName}"]`);
  private icon = this.getElement(`[data-component="${A02Icon.displayName}"] svg path`);
  private timeline?: TimelineMax;
  private originalLabel: any = '';

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new M44CopyProgressIndicatorTransitionController(this);
  }

  public handleProgress(): void {
    const copiedLabel = this.copiedLabel?.getAttribute('data-copied-label');
    const labelText = this.getElement(
      `[data-component="${A07Label.displayName}"]`,
    )?.innerText.toString();
    if (copiedLabel?.toLowerCase() !== labelText?.toLowerCase()) {
      this.originalLabel = labelText;
    }

    this.timeline = new TimelineMax();

    if (this.progress && this.label && this.icon) {
      this.timeline.to(this.label, 0.05, {
        color: 'white',
      });
      this.timeline.to(this.icon, 0.05, {
        fill: 'white',
      });
      this.timeline.fromTo(
        this.progress,
        0.7,
        {
          visibility: 'visible',
          transformOrigin: 'left 50%',
          scaleX: 0,
        },
        {
          scaleX: 1,
        },
      ),
        this.timeline.to(this.label, 0.5, {
          color: 'white',
          innerText: copiedLabel,
        });
    }
  }

  public handleResetProgress(): void {
    if (this.timeline && this.progress && this.label && this.icon) {
      this.timeline.pause().progress(0);
      this.timeline.set(this.label, { clearProps: 'all', innerText: this.originalLabel });
      this.timeline.set(this.icon, { clearProps: 'all' });
      this.timeline.set(this.progress, { clearProps: 'all' });
    }
  }
}
