import { AbstractEvent } from 'seng-event';

export class O06CollapsibleItemEvent extends AbstractEvent {
  public static types = {
    CLICK: 'CLICK',
  };

  public data: { label: string };

  constructor(
    type: string,
    data: { label: string },
    bubbles?: boolean,
    cancelable?: boolean,
    setTimeStamp?: boolean,
  ) {
    super(type, bubbles, cancelable, setTimeStamp);
    this.data = data;
  }

  public clone(): O06CollapsibleItemEvent {
    return new O06CollapsibleItemEvent(this.type, this.data, this.bubbles, this.cancelable);
  }
}
