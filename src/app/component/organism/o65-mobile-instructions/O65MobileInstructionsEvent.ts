import { AbstractEvent } from 'seng-event';

export class O65MobileInstructionsEvent extends AbstractEvent {
  public static SHOW_INSTRUCTIONS: string = 'SHOW_INSTRUCTIONS';

  constructor(type: string, bubbles?: boolean, cancelable?: boolean, setTimeStamp?: boolean) {
    super(type, bubbles, cancelable, setTimeStamp);
  }

  public clone(): O65MobileInstructionsEvent {
    return new O65MobileInstructionsEvent(this.type, this.bubbles, this.cancelable);
  }
}
