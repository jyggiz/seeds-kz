import { AbstractEvent } from 'seng-event';

export class O64HotspotMapEvent extends AbstractEvent {
  public static UPDATE_MAP: string = 'UPDATE_MAP';

  public readonly hotspots: readonly HTMLElement[] = [];

  constructor(
    type: string,
    hotspots: readonly HTMLElement[],
    bubbles?: boolean,
    cancelable?: boolean,
    setTimeStamp?: boolean,
  ) {
    super(type, bubbles, cancelable, setTimeStamp);

    this.hotspots = hotspots;
  }

  public clone(): O64HotspotMapEvent {
    return new O64HotspotMapEvent(this.type, this.hotspots, this.bubbles, this.cancelable);
  }
}
