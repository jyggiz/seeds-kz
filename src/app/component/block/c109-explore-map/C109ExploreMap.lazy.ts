import delay from 'lodash-es/delay';
import { DeviceStateEvent } from 'seng-device-state-tracker';

import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O64HotspotMap from 'app/component/organism/o64-hotspot-map/O64HotspotMap.lazy';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import mq from '../../../data/shared-variable/media-queries.json';
import C109ExploreMapTransitionController from './C109ExploreMapTransitionController';
import M26HotspotButton from 'app/component/molecule/m26-hotspot-button/M26HotspotButton';
import { O64HotspotMapEvent } from 'app/component/organism/o64-hotspot-map/O64HotspotMapEvent';
import App from 'app/component/layout/app/App';
import { getAppComponent } from 'app/util/getElementComponent';
import { MODAL } from 'app/util/overlayActionTypes';
import { C109Tags } from './C109ExploreMap.types';

import './c109-explore-map.scss';

const lazyFiltersModalTemplate = () =>
  import('./component/filters-modal/filters-modal.hbs?include') as LoadTemplateImport<{}>;

export default class C109ExploreMap extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c109-explore-map';
  public readonly transitionController: C109ExploreMapTransitionController;
  private app: App | null = null;
  private readonly _hotspotMapComponent = this.getComponent<O64HotspotMap>(
    O64HotspotMap.displayName,
  );
  private readonly contentItems = this.getElements('[data-content-item');
  private readonly hotspotButtons = this.getElements(
    `[data-component="${M26HotspotButton.displayName}"]`,
  );
  private readonly hotspotsWrappers = this.getElements('[data-hotspot]');
  private hotspotContainer = this.getElement('[data-hotspot-container]');
  private readonly tagButtons = this.getElements<HTMLInputElement>('[data-tag-button]');
  private readonly filtersPayload: C109Tags | null = JSON.parse(
    this.getElement('[data-filters-payload]')?.dataset.filtersPayload || 'null',
  );
  private readonly filtersToggleButton = this.getElement('[data-filter-toggle]');
  private isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.MEDIUM;
  private selectedTags: string[];
  private shouldHotspotOpenInModal =
    deviceStateTracker.currentDeviceState.state < mq.deviceState.LARGE;
  private currentIndex: number = 0;
  private DELAY_BEFORE_CONTENT_CHANGE = 300;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new C109ExploreMapTransitionController(this);

    this.selectedTags = this.tagButtons.map((tag) => tag.value);
    this.addEventListeners();
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();
  }

  private get hotspotMapComponent(): O64HotspotMap {
    if (!this._hotspotMapComponent) {
      throw new Error("Hotspot map component doesn't exist");
    }

    return this._hotspotMapComponent;
  }

  private addEventListeners() {
    this.hotspotMapComponent.onHotSpotClick = (index: number) => {
      if (this.shouldHotspotOpenInModal) this.hotspotMapComponent?.openCarousel(index);
    };

    if (!this.isMobile) {
      this.hotspotsWrappers.forEach((hotspot, index) => {
        ['mouseenter', 'mouseleave'].forEach((event) => {
          this.addDisposableEventListener(hotspot, event, () => {
            delay(() => this.onDesktopHotspotInteract(index + 1), this.DELAY_BEFORE_CONTENT_CHANGE);
          });
        });

        this.addDisposableEventListener(hotspot, 'click', () =>
          this.hotspotContainer?.classList.remove(StateClassNames.DISABLED),
        );
      });
    }

    this.addTagsButtonsEventListeners(this.tagButtons);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      this.onDeviceStateChange.bind(this),
    );

    if (this.filtersToggleButton) {
      this.addDisposableEventListener(
        this.filtersToggleButton,
        'click',
        this.openFiltersModal.bind(this),
      );
    }
  }

  private addTagsButtonsEventListeners(tagButtons: readonly HTMLInputElement[]): void {
    tagButtons.forEach((tag) => {
      this.addDisposableEventListener(tag, 'change', () => {
        this.selectedTags = Array.from(tagButtons)
          .filter((element) => element.checked)
          .map((tag) => tag.value);
        const selectedHotspots = this.filterHotspotsByTags(
          this.hotspotsWrappers,
          this.selectedTags,
        );

        this.hotspotMapComponent.dispatcher.dispatchEvent(
          new O64HotspotMapEvent(O64HotspotMapEvent.UPDATE_MAP, selectedHotspots),
        );
      });
    });
  }

  private async openFiltersModal() {
    if (!this.filtersPayload || !this.app) return;
    const payload = this.filtersPayload;

    payload.items = payload.items.map((item) => {
      return {
        ...item,
        active: this.selectedTags.includes(item.id),
      };
    });

    const [filtersModalTemplate, overlay] = await Promise.all([
      lazyFiltersModalTemplate(),
      this.app.overlay,
    ]);

    await overlay.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: filtersModalTemplate.default,
        data: payload,
      },
    });

    const modalTagButtons = this.app?.element.querySelectorAll(
      '.o-modal [data-tag-button]',
    ) as unknown as HTMLInputElement[];
    this.addTagsButtonsEventListeners(modalTagButtons);
  }

  private onDeviceStateChange(): void {
    const previousIsMobile = this.isMobile;
    this.isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.MEDIUM;
    this.shouldHotspotOpenInModal =
      deviceStateTracker.currentDeviceState.state < mq.deviceState.LARGE;

    if (this.isMobile !== previousIsMobile) {
      this.resetMap();
    }
  }

  private onDesktopHotspotInteract(index: number) {
    const newIndex = index === this.currentIndex ? 0 : index;
    this.toggleStates(this.currentIndex, newIndex);
    this.currentIndex = newIndex;
  }

  private toggleStates(previousSlideIndex: number, newSlideIndex: number) {
    this.contentItems[previousSlideIndex].classList.remove(StateClassNames.ACTIVE);
    this.contentItems[newSlideIndex].classList.add(StateClassNames.ACTIVE);
    if (newSlideIndex !== 0) {
      this.hotspotButtons[newSlideIndex - 1].classList.add(StateClassNames.ACTIVE);
    }
    if (previousSlideIndex !== 0) {
      this.hotspotButtons[previousSlideIndex - 1].classList.remove(StateClassNames.ACTIVE);
    }
  }

  private filterHotspotsByTags(
    hotspots: readonly HTMLElement[],
    selectedTags: string[],
  ): readonly HTMLElement[] {
    return hotspots.filter((currentHotspot) => {
      const hotspotData = JSON.parse(currentHotspot.dataset.item || '{}');

      if (!('tag' in hotspotData)) {
        return false;
      }

      return selectedTags.includes(hotspotData.tag);
    });
  }

  private resetMap(): void {
    this.tagButtons.forEach((tagButton) => {
      tagButton.checked = true;
    });

    this.hotspotMapComponent.dispatcher.dispatchEvent(
      new O64HotspotMapEvent(O64HotspotMapEvent.UPDATE_MAP, this.hotspotsWrappers),
    );
  }
}
