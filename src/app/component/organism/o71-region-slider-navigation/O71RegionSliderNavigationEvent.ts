import { AbstractEvent } from 'seng-event';
import O71RegionSliderNavigation from './O71RegionSliderNavigation.lazy';

export default class O71RegionSliderNavigationEvent extends AbstractEvent {
  public static UPDATE: string = 'update';

  public readonly regionId: number = 0;

  constructor(type: string, regionId: number, bubbles?: boolean, cancelable?: boolean) {
    super(type, bubbles, cancelable);

    this.regionId = regionId;
  }
  clone(): O71RegionSliderNavigationEvent {
    return new O71RegionSliderNavigationEvent(
      this.type,
      this.regionId,
      this.bubbles,
      this.cancelable,
    );
  }
}
