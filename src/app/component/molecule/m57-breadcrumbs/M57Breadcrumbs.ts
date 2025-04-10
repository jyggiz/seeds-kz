import AbstractComponent from 'app/component/AbstractComponent';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class M57Breadcrumbs extends AbstractComponent {
  public static readonly displayName: string = 'm57-breadcrumbs';

  private readonly breadcrumbsItems = this.getElements('[data-breadcrumbs-item]');

  private isMobile: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  private setBreadcrumbsStructure() {
    if (this.isMobile) {
      let isClickableParentFound = false;

      for (let i = this.breadcrumbsItems.length - 1; i >= 0; i--) {
        const breadcrumbItem = this.breadcrumbsItems[i];

        if (isClickableParentFound) {
          breadcrumbItem.classList.add(StateClassNames.HIDDEN);
          continue;
        }

        const isActive = breadcrumbItem.classList.contains(StateClassNames.ACTIVE);
        const isClickable = !breadcrumbItem.classList.contains('-isNotClickable');

        isClickableParentFound = !isActive && isClickable;

        if (!isClickableParentFound) {
          breadcrumbItem.classList.add(StateClassNames.HIDDEN);
        }
      }
    } else {
      this.breadcrumbsItems.forEach((item) => {
        item.classList.remove(StateClassNames.HIDDEN);
      });
    }
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.MEDIUM;

    this.setBreadcrumbsStructure();
  }
}
