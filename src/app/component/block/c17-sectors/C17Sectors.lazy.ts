import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C17SectorsTransitionController from './C17SectorsTransitionController';
import M11SectorButton from '../../molecule/m11-sector-button/M11SectorButton';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getAppComponent } from '../../../util/getElementComponent';
import TrackingEvent from '../../../util/TrackingEvent';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import App from '../../layout/app/App';
import { MODAL } from 'app/util/overlayActionTypes';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O11ModalContentProps from 'app/component/organism/o11-modal-content/O11Modal.types';
import { registerComponent } from 'muban-core';

import './c17-sectors.scss';

const lazyO11Template = () =>
  import(
    '../../organism/o11-modal-content/o11-modal-content.hbs?include'
  ) as LoadTemplateImport<O11ModalContentProps>;

export default class C17Sectors extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c17-sectors';

  public readonly transitionController: C17SectorsTransitionController;

  private readonly sectorItems = this.getComponents<M11SectorButton>(M11SectorButton.displayName);
  private readonly sectorPlaceholders = this.getElements(`[data-sector-placeholder]`);

  private readonly sectorBackgrounds = this.getElements('[data-background]');
  private readonly sectorCircles = this.getElements('[data-sector-circle]');

  private activeIndex: number = 1;
  private isModalOpen: boolean = false;
  private isMobile: boolean = false;
  private app: App | null = null;
  private resetActiveStateTimeoutId: number | null = null;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new C17SectorsTransitionController(this);

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    this.addEventListeners();
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    if (state > mq.deviceState.SMALL) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  private addEventListeners(): void {
    this.sectorCircles.forEach((sectorItem, index) => {
      if (sectorItem) {
        if (!this.isMobile) {
          this.addDisposableEventListener(sectorItem, 'mouseenter', () => {
            if (sectorItem.classList.contains('-isCurrent')) return;
            this.onSectorMouseEnter(index);
          });
        }
        this.addDisposableEventListener(sectorItem, 'click', (e) => {
          e.preventDefault();
          if (sectorItem.classList.contains('-isCurrent')) return;
          this.onSectorClick(index);
        });
        this.addDisposableEventListener(
          sectorItem,
          'mouseleave',
          this.onSectorMouseLeave.bind(this),
        );
      }
    });
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();

    this.addDisposableEventListener(this.app?.element, 'overlayAction', (event) => {
      const type = (event as unknown as CustomEvent).detail.type;
      if (type === MODAL.CLOSE) {
        this.isModalOpen = false;
        this.resetSectorItem();
      }
    });
  }

  private onSectorMouseEnter(index: number): void {
    if (this.resetActiveStateTimeoutId) {
      clearTimeout(this.resetActiveStateTimeoutId);
      this.resetActiveStateTimeoutId = null;
      this.resetSectorItem();
    }
    this.element.classList.add(StateClassNames.ACTIVE);

    this.updateBackgroundImage(index);
    this.updateSectorItem();
  }

  private async onSectorClick(index: number): Promise<void> {
    const sectorHref = this.sectorItems[index].element.getAttribute('href');

    if (sectorHref) {
      window.location.href = sectorHref;
      return;
    }

    this.isModalOpen = true;
    this.trackingSector(index);

    const { content } = this.sectorItems[index].element.dataset;
    if (content === undefined) {
      throw new Error('Sector content was not found');
    }
    if (this.app === null) {
      throw new Error('App was not found');
    }

    const data = JSON.parse(content);

    const [o11Template, overlay] = await Promise.all([lazyO11Template(), this.app?.overlay]);

    await overlay.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: o11Template.default,
        data,
      },
    });
  }

  private onSectorMouseLeave(): void {
    if (this.isModalOpen) return;
    this.resetActiveStateTimeoutId = setTimeout(this.resetSectorItem.bind(this), 150);
  }

  private resetSectorItem(): void {
    this.element.classList.remove(StateClassNames.ACTIVE);

    const currentBackground = this.sectorBackgrounds[this.activeIndex];

    if (currentBackground) {
      currentBackground.classList.remove(StateClassNames.ACTIVE);
    }

    this.sectorItems.forEach((sectorItem) => {
      sectorItem.enable();
    });

    this.sectorPlaceholders.forEach((placeholder) => {
      placeholder.classList.remove(StateClassNames.DISABLED);
    });
  }

  private updateBackgroundImage(index: number): void {
    const previousSector = this.sectorBackgrounds[this.activeIndex];
    const currentSector = this.sectorBackgrounds[index];

    if (previousSector) {
      previousSector.classList.remove(StateClassNames.ACTIVE);
    }
    if (currentSector) {
      currentSector.classList.add(StateClassNames.ACTIVE);
    }
    this.activeIndex = index;
  }

  private updateSectorItem(): void {
    this.sectorItems.forEach((sectorItem, index) => {
      if (index === this.activeIndex) {
        sectorItem.enable();
      } else {
        sectorItem.disable();
      }
    });

    this.sectorPlaceholders.forEach((placeholder) => {
      placeholder.classList.add(StateClassNames.DISABLED);
    });
  }

  private trackingSector(index: number): void {
    const { eventTracking } = this.sectorItems[index].element.dataset;
    if (!eventTracking) {
      throw new Error('eventTracking was not found');
    }

    TrackingEvent(JSON.parse(eventTracking));
  }
}
