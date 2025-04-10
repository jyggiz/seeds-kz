import AbstractComponent from 'app/component/AbstractComponent';
import M02Button from 'app/component/molecule/m02-button/M02Button';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import {
  ItineraryItem,
  ModalListVariant,
  O67ModalListViewerProps,
} from './O67ModalListViewer.types';
import C61HotspotMap from 'app/component/block/c61-hotspot-map/C61HotspotMap.lazy';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { MODAL } from 'app/util/overlayActionTypes';
import { O68ModalListContentProps } from '../o68-modal-list-content/O68ModalListContent.types';
import { StateThemeClassNames } from 'app/data/enum/StateClassNames';

import './o67-modal-list-viewer.scss';

const LazyContentTemplates = {
  [ModalListVariant.Itineraries]: () =>
    import(
      '../o68-modal-list-content/o68-modal-list-content.hbs?include'
    ) as LoadTemplateImport<O68ModalListContentProps>,
  [ModalListVariant.GroupedHotspots]: () =>
    import(
      '../o68-modal-list-content/o68-modal-list-content.hbs?include'
    ) as LoadTemplateImport<O68ModalListContentProps>,
};
export default class O67ModalListViewer extends AbstractComponent {
  public static readonly displayName: string = 'o67-modal-list-viewer';
  private openModalButton: HTMLButtonElement | null = this.getElement(
    `[data-component="${M02Button.displayName}"]`,
  );
  private app: App | null = null;
  private readonly dataModalListItems: O67ModalListViewerProps | undefined =
    this.element.dataset.modalProps && JSON.parse(this.element.dataset.modalProps);

  constructor(el: HTMLElement) {
    super(el);

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  public async adopted(): Promise<void> {
    this.app = await getAppComponent();

    this.openModalButton &&
      this.addDisposableEventListener(this.openModalButton, 'click', async (e) => {
        if (!this.dataModalListItems) {
          throw new Error('Not able to get props data');
        }

        const listType = this.dataModalListItems.type;

        if (
          listType === ModalListVariant.GroupedHotspots ||
          listType === ModalListVariant.Itineraries
        ) {
          if (listType === ModalListVariant.Itineraries) {
            const c61Node = this.app?.getElement(`[data-component='${C61HotspotMap.displayName}']`);

            c61Node && c61Node.scrollIntoView({ behavior: 'smooth' });
          }

          const lazyContentTemplate = LazyContentTemplates[listType];
          const template = await lazyContentTemplate();
          const data = this.dataModalListItems;
          const overlay = await this.app?.overlay;

          await overlay?.dispatchAction({
            type: MODAL.STANDARD_DYNAMIC,
            payload: {
              template: template.default,
              data,
              options: {
                classnames: ['-fullBleedCarousel'],
              },
            },
          });
        }
      });
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    if (state <= mq.deviceState.SMALL) {
      if (!this.openModalButton?.classList.contains(StateThemeClassNames.WHITE)) {
        this.openModalButton?.classList.add(StateThemeClassNames.WHITE);
        this.openModalButton?.classList.remove(StateThemeClassNames.DARKGOLD);
      }
    } else {
      if (!this.openModalButton?.classList.contains(StateThemeClassNames.DARKGOLD)) {
        this.openModalButton?.classList.add(StateThemeClassNames.DARKGOLD);
        this.openModalButton?.classList.remove(StateThemeClassNames.WHITE);
      }
    }
  }
}
