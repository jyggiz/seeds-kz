import { AbstractEvent } from 'seng-event';

export class M47HamburgerMenuEvent extends AbstractEvent {
  public static types = {
    TOGGLE_MENU: 'TOGGLE_MENU',
  };

  public clone(): M47HamburgerMenuEvent {
    return new M47HamburgerMenuEvent(this.type);
  }
}
