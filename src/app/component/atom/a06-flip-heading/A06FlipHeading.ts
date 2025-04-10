import { TweenMax } from 'gsap';

import AbstractComponent from '../../AbstractComponent';
import { isRtl } from '../../../util/rtlUtils';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class A06FlipHeading extends AbstractComponent {
  public static readonly displayName: string = 'a06-flip-heading';

  private flipLabels = this.getElements('[data-flip-label]');
  private flipLabelsContainer = this.getElement('[data-flip-labels]');

  private headingAnimationTimeout: number | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.toHeading(0);
    this.flipAnimation(isRtl());
    this.setFlipLabelsContainerHeight();
  }

  private setFlipLabelsContainerHeight(): void {
    if (!this.flipLabelsContainer) return;

    const highestFlipLabel = this.flipLabels.reduce((prev, current) =>
      prev.offsetHeight > current.offsetHeight ? prev : current,
    );
    this.flipLabelsContainer.style.height = `${highestFlipLabel.offsetHeight}px`;
  }

  private flipAnimation(isRtl: boolean): void {
    TweenMax.staggerTo(
      this.flipLabels,
      0,
      {
        cycle: {
          xPercent: (index: number) => index * (isRtl ? 100 : -100),
        },
      },
      0,
    );
  }

  private toHeading(index: number): void {
    this.hideAll();
    this.flipLabels[index].classList.add(StateClassNames.VISIBLE);

    this.headingAnimationTimeout = setTimeout(() => {
      const nextIndex = index + 1;

      this.toHeading(nextIndex >= this.flipLabels.length ? 0 : nextIndex);
    }, 2800);
  }

  private hideAll(): void {
    this.flipLabels.forEach((elm) => {
      elm.classList.remove(StateClassNames.VISIBLE);
    });
  }

  public dispose() {
    super.dispose();

    if (this.headingAnimationTimeout) {
      clearTimeout(this.headingAnimationTimeout);
    }
  }
}
