import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C68FontStylesTransitionController from './C68FontStylesTransitionController';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import M14ToggleButton from 'app/component/molecule/m14-toggle-button/M14ToggleButton';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c68-font-styles.scss';

export default class C68FontStyles extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c68-font-styles';

  public readonly transitionController: C68FontStylesTransitionController;

  private activeIndex: number | null = null;
  private isMobile: boolean = false;

  private table = this.getElement('[data-table]');
  private accordionWrapper = this.getElement('[data-accordion-wrapper]');
  private accordions = this.getElements('[data-accordion]');
  private accordionToggleButtons = this.getElements(
    `[data-component="${M14ToggleButton.displayName}"]`,
  );
  private accordionBodies = this.getElements('[data-accordion-body]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C68FontStylesTransitionController(this);
    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addEventListeners();

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private addEventListeners(): void {
    if (this.accordions) {
      this.accordions.forEach((accordion, index) => {
        this.addDisposableEventListener(accordion, 'click', () => {
          if (index === this.activeIndex) {
            this.transitionController.toggleAccordion(this.accordionBodies[index], false);
            this.activeIndex = null;
          } else {
            if (this.activeIndex !== null)
              this.transitionController.toggleAccordion(
                this.accordionBodies[this.activeIndex],
                false,
              );
            this.transitionController.toggleAccordion(this.accordionBodies[index], true);

            this.activeIndex = index;
          }
          this.accordionToggleButtons[index].classList.toggle('-rotate');
        });
      });
    }
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    if (this.table && this.accordionWrapper) {
      if (state > mq.deviceState.SMALL) {
        this.table.classList.remove(StateClassNames.HIDDEN);
        this.accordionWrapper.classList.add(StateClassNames.HIDDEN);
      } else {
        this.table.classList.add(StateClassNames.HIDDEN);
        this.accordionWrapper.classList.remove(StateClassNames.HIDDEN);
      }
    }
  }
  private expandAccordionBody(): void {}
}
