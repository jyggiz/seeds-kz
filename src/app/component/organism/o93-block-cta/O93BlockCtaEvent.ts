import { AbstractEvent } from 'seng-event';

export default class O93BlockCtaEvent extends AbstractEvent {
  public static OPEN_MODAL: string = 'OPEN_MODAL';

  public readonly element: HTMLElement;

  constructor(type: string, element: HTMLElement, bubbles?: boolean, cancelable?: boolean) {
    super(type, bubbles, cancelable);

    this.element = element;
  }
  clone(): O93BlockCtaEvent {
    return new O93BlockCtaEvent(this.type, this.element, this.bubbles, this.cancelable);
  }
}
