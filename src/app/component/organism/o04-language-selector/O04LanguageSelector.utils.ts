import { AbstractEvent } from 'seng-event';

export class O04LanguageSelectorEvent extends AbstractEvent {
  public static types = {
    TOGGLE_DROPDOWN: 'TOGGLE_DROPDOWN',
  };

  public clone(): O04LanguageSelectorEvent {
    return new O04LanguageSelectorEvent(this.type);
  }
}
