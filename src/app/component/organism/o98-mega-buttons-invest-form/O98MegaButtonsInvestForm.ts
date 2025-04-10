import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import deviceStateTracker from 'app/util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { TweenLite } from 'gsap';
import {
  getValidationAttributes,
  validateFields,
  ValidationResult,
} from 'app/util/form-validation/validateJSHelpers';
import { MegaButtonComponentNames } from './O98MegaButtonsInvestForm.types';
import { isEditor } from 'app/util/aemEditorUtils';

export default class O98MegaButtonsInvestForm extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o98-mega-buttons-invest-form';

  private readonly drilldownControls = this.getElements('[data-for-button-id]');
  private readonly mobileDrilldowns = this.getElements('[data-mobile-control]');
  private readonly desktopDrilldowns = this.getElements('[data-desktop-control]');

  private activeControl: null | HTMLElement = null;

  constructor(el: HTMLElement) {
    super(el);

    if (!this.drilldownControls.length) {
      return;
    }

    this.setupMegaButtonEventListeners();
    this.setupDeviceStateUpdateListener();
    this.setupSubmitEventListener();
    this.assignHeightToDrilldownContainer();
  }

  assignHeightToDrilldownContainer() {
    const isSmallerViewport = this.currentDeviceState.state < mq.deviceState.LARGE;
    const drilldowns = isSmallerViewport ? this.mobileDrilldowns : this.desktopDrilldowns;

    const drilldownControlsHeights = this.drilldownControls.map((element) => element.offsetHeight);
    const drilldownHeights = drilldowns.map((element) => {
      return element.offsetHeight;
    });

    if (!isEditor()) {
      this.drilldownControlsContainer.style.height = `${
        Math.max(...drilldownHeights) + Math.max(...drilldownControlsHeights)
      }px`;
    }
  }

  setupSubmitEventListener() {
    const submitButtons = this.getElements('[data-submit]');

    submitButtons.forEach((button) =>
      this.addDisposableEventListener(button, 'click', () => {
        const validationErrors = validateFields(this.activeControlField);
        this.manageValidationErrors(validationErrors);

        if (!validationErrors) {
          const urlValue = Object.values(getValidationAttributes(this.activeControlField))[0];

          if (!urlValue) {
            throw new Error('Cannot get url to redirect user to from drilldown controls');
          }
          window.location.href = urlValue;
        }
      }),
    );
  }

  setupDeviceStateUpdateListener() {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      () => this.manageDrilldownVisibilityPerDeviceState(),
    );
  }

  setupMegaButtonEventListeners() {
    this.megaButtons.forEach((megaButton) => {
      const buttonId = megaButton.id;
      if (!buttonId) {
        throw new Error('no button id found');
      }
      const predicate = (control: HTMLElement) => control.dataset.forButtonId === buttonId;
      const activeControl: HTMLElement = this.drilldownControls.filter(predicate)[0];
      const restOfControlElements: Array<HTMLElement> = this.drilldownControls.filter(
        (control) => !predicate(control),
      );

      if (activeControl) {
        this.addDisposableEventListener(megaButton, 'click', (event) => {
          event.preventDefault();
          this.activeControl = activeControl;
          this.manageDrilldownVisibilityPerDeviceState();
          this.manageDrilldownControlsVisibility(true, [activeControl]);
          if (restOfControlElements.length) {
            this.manageDrilldownControlsVisibility(false, restOfControlElements);
          }
        });
      }
    });
  }

  manageDrilldownControlsVisibility(visible: boolean, controlElements: Array<HTMLElement>) {
    controlElements.forEach((el) => this.updateElementVisibility(visible, el));
  }

  manageDrilldownVisibilityPerDeviceState() {
    if (this.activeControl === null) {
      return;
    }

    const isSmallerViewport = this.currentDeviceState.state < mq.deviceState.LARGE;
    const desktopContainer = this.getElement('[data-desktop-control]', this.activeControl);
    const mobileContainer = this.getElement('[data-mobile-control]', this.activeControl);

    if (!desktopContainer) throw new Error('could not find desktop control');
    if (!mobileContainer) throw new Error('could not find mobile control');
    this.updateElementVisibility(isSmallerViewport, mobileContainer, 0);
    this.updateElementVisibility(!isSmallerViewport, desktopContainer, 0);
    this.assignHeightToDrilldownContainer();
  }

  updateElementVisibility(visible: boolean, element: HTMLElement, delay: number = 1) {
    TweenLite.to(element, delay, { autoAlpha: visible ? 1 : 0 });
  }

  manageValidationErrors(errors: ValidationResult) {
    const id = this.activeControlField.id;
    const errorField = this.getElement(
      `[data-error-message][data-for="${id}"]`,
      this.activeFormControl,
    );
    if (!errorField) {
      throw new Error('cannot findfield error for drilldown control');
    }

    if (!errors) {
      errorField.innerText = '';
      return;
    }
    const [errorMessage] = errors[id];
    errorField.innerText = errorMessage;
  }

  // GETTERS

  get drilldownControlsContainer() {
    const container = this.getElement('[data-drilldown-container]');
    if (!container) {
      throw new Error('cannot find drilldown container');
    }

    return container;
  }

  get activeControlField() {
    const inputControl = this.getElement('[data-validate]', this.activeFormControl) as
      | HTMLSelectElement
      | HTMLFieldSetElement;
    if (!inputControl) {
      throw new Error('cannot find input for drilldown control');
    }

    return inputControl;
  }

  get currentDeviceState() {
    return deviceStateTracker.currentDeviceState;
  }

  get activeFormControl() {
    if (this.activeControl === null) {
      throw new Error('cannot find active control binding');
    }

    const activeFormControlContainer = this.getElement(
      '[data-form-control-container]',
      this.activeControl,
    );
    const activeFormControl = activeFormControlContainer?.firstElementChild as HTMLElement;
    if (!activeFormControl) {
      throw new Error('Cannot find active form control');
    }

    return activeFormControl;
  }

  get megaButtonsContainer() {
    const query = `[data-mega-buttons]`;
    const megaButtonsContainer = this.getElement(query);

    if (!megaButtonsContainer) {
      throw new Error(`cannot find ${query}`);
    }

    return megaButtonsContainer;
  }

  get megaButtons() {
    const gridItems = Array.from(this.megaButtonsContainer.querySelectorAll('[data-grid-item]'));
    const possibleComponentNames = Object.values(MegaButtonComponentNames);

    const megaButtons = gridItems.map((gridItem) => {
      const megaButton = possibleComponentNames
        .map(
          (componentName) =>
            gridItem.querySelector(`[data-component="${componentName}"]`) as HTMLElement,
        )
        .find((_) => _);

      if (!megaButton) {
        throw new Error(`could not find component for mega button`);
      }

      return megaButton;
    });

    return megaButtons;
  }
}
