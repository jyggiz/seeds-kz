import AbstractComponent from 'app/component/AbstractComponent';
import { O93BlockCtaProps, O93BlockCtaTypes } from './O93BlockCta.types';
import O93BlockCtaEvent from './O93BlockCtaEvent';
import { StateClassNames } from 'app/data/enum/StateClassNames';

export default class O93BlockCta extends AbstractComponent {
  public static readonly displayName: string = 'o93-block-cta';

  private readonly video = this.getElement<HTMLVideoElement>('[data-video]');
  private readonly actionIndicator = this.getElement<HTMLDivElement>('[data-action-indicator]');
  private readonly payload = this.getPayload();

  constructor(el: HTMLElement) {
    super(el);

    this.addEventListeners();

    if (this.isLink() || this.isModal()) {
      this.addActionStyles();
    }

    if (!this.isLink() && !this.isModal()) {
      this.hideActionIndicator();
    }
  }

  private addEventListeners() {
    if (this.video) {
      ['focus', 'mouseover'].forEach((event) => {
        this.addDisposableEventListener(this.element, event, () => {
          this.video?.play();
        });
      });

      ['blur', 'mouseout'].forEach((event) => {
        this.addDisposableEventListener(this.element, event, () => {
          if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
          }
        });
      });
    }

    if (!this.isLink() && this.isModal()) {
      this.addDisposableEventListener(this.element, 'click', () => {
        this.dispatcher.dispatchEvent(
          new O93BlockCtaEvent(O93BlockCtaEvent.OPEN_MODAL, this.element),
        );
      });
    }
  }

  public isLink(): boolean {
    return !!this.payload.type && this.payload.type === O93BlockCtaTypes.LINK;
  }

  private isModal(): boolean {
    return !!this.payload.type && this.payload.type === O93BlockCtaTypes.MODAL;
  }

  private addActionStyles(): void {
    this.element.classList.add('-hasAction');
  }

  private hideActionIndicator(): void {
    this.actionIndicator?.classList.add(StateClassNames.HIDDEN);
  }

  public getPayload(): O93BlockCtaProps {
    return JSON.parse(this.element.dataset.payload || '{}');
  }
}
