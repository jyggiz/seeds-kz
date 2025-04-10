import { AbstractEvent } from 'seng-event';
import { EVENT_TYPE_PLACEHOLDER, generateEventTypes } from 'seng-event/lib/util/eventTypeUtils';

export type FormEventType = typeof FormEvent.RESET;

class FormEvent extends AbstractEvent {
  /**
   * Sent when the form needs to be reset.
   */
  public static readonly RESET: string = EVENT_TYPE_PLACEHOLDER;

  constructor(type: string, bubbles?: boolean, cancelable?: boolean, setTimeStamp?: boolean) {
    super(type, bubbles, cancelable, setTimeStamp);
  }

  public clone(): FormEvent {
    return new FormEvent(this.type, this.bubbles, this.cancelable);
  }
}

generateEventTypes({ FormEvent });

export default FormEvent;
