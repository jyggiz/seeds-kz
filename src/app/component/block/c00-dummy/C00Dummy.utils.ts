import { AbstractEvent } from 'seng-event';

export class C00DummyEvent extends AbstractEvent {
  public static types = {
    NAVIGATION_HEIGHT: 'NAVIGATION_HEIGHT',
  };

  public readonly height: number = 0;

  constructor(type: string, height: number, bubbles?: boolean, cancelable?: boolean) {
    super(type, bubbles, cancelable);

    this.height = height;
  }

  clone(): C00DummyEvent {
    return new C00DummyEvent(this.type, this.height, this.bubbles, this.cancelable);
  }
}
