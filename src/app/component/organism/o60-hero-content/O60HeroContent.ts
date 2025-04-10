import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import M34ComponentBackground from 'app/component/molecule/m34-component-background/M34ComponentBackground';
import M53TileCta from '../../molecule/m53-tile-cta/M53TileCta';
import M58PillarCta from '../../molecule/m58-pillar-cta/M58PillarCta';
import O60HeroContentTransitionController from './O60HeroContentTransitionController';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class O60HeroContent extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o60-hero-content';
  public readonly transitionController: O60HeroContentTransitionController;
  private isMobile: boolean = false;

  private readonly componentBackground = this.getElement(
    `:scope > [data-component=${M34ComponentBackground.displayName}]`,
  );

  private readonly backgroundItems = this.getElements(`[data-item-background]`);
  private readonly tileButtons = this.getElements(`[data-component=${M53TileCta.displayName}]`);
  private readonly pillarButtons = this.getElements(`[data-component=${M58PillarCta.displayName}]`);

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O60HeroContentTransitionController(this);

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.addHoverEventListener();
  }

  private addHoverEventListener(): void {
    if (!this.backgroundItems || this.backgroundItems.length <= 0) {
      return;
    }

    const buttons = this.tileButtons.length > 0 ? this.tileButtons : this.pillarButtons;

    buttons.forEach((button, index) => {
      const backgroundItem = this.backgroundItems.find(
        (item) => Number(item?.dataset.itemIndex) === index,
      );

      this.addDisposableEventListener(button, 'mouseenter', () => {
        this.toggleBackgroundItemVisibility(backgroundItem, true);
      });
      this.addDisposableEventListener(button, 'mouseleave', () => {
        this.toggleBackgroundItemVisibility(backgroundItem, false);
      });
    });
  }

  private toggleBackgroundItemVisibility(
    backgroundItem: HTMLElement | undefined,
    visible: boolean,
  ) {
    if (this.isMobile || !backgroundItem) return;

    backgroundItem?.classList[visible ? 'add' : 'remove'](StateClassNames.ACTIVE);
    this.toggleBackgroundVisibility(!visible);
  }

  private toggleBackgroundVisibility(visible: boolean = false): void {
    this.componentBackground?.classList[!visible ? 'add' : 'remove'](StateClassNames.HIDDEN);
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.SMALL;
  }
}
