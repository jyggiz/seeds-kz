import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C61HotspotMapTransitionController from './C61HotspotMapTransitionController';
import mq from '../../../data/shared-variable/media-queries.json';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O64HotspotMap from 'app/component/organism/o64-hotspot-map/O64HotspotMap.lazy';
import O65MobileInstructions from 'app/component/organism/o65-mobile-instructions/O65MobileInstructions.lazy';
import { O65MobileInstructionsEvent } from 'app/component/organism/o65-mobile-instructions/O65MobileInstructionsEvent';

import './c61-hotspot-map.scss';

export default class C61HotspotMap extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c61-hotspot-map';

  private readonly o64HotspotMap = this.getComponent<O64HotspotMap>(O64HotspotMap.displayName);
  private readonly o65MobileInstructions = this.getComponent<O65MobileInstructions>(
    O65MobileInstructions.displayName,
  );

  public readonly transitionController: C61HotspotMapTransitionController;
  private readonly isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.MEDIUM;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C61HotspotMapTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);

    if (this.o65MobileInstructions && this.isMobile) {
      this.o64HotspotMap?.hideContent();

      this.addDisposableEventListener(
        this.o65MobileInstructions?.dispatcher,
        O65MobileInstructionsEvent.SHOW_INSTRUCTIONS,
        () => {
          this.o64HotspotMap?.showContent();
        },
      );
    }
  }
}
