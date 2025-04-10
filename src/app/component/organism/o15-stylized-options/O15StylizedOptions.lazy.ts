import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { updateClassForItems } from 'app/util/stateClassNamesToggle';
import O15StylizedOptionsTransitionController from './O15StylizedOptionsTransitionController';
import { renderDependentDropdown } from 'app/util/fieldsets/renderDependentDropdown';
import M31DropdownField from 'app/component/molecule/m31-dropdown-field/M31DropdownField.lazy';
import O80MultiselectDropdown from '../o80-multiselect-dropdown/O80MultiselectDropdown.lazy';
import { getComponentForElement } from 'muban-core';
import { renderDependentMultiChoiceDropdown } from 'app/util/fieldsets/renderDependentMultiChoiceDropdown';
import { assignDependentInputsToRadioGroup } from 'app/util/fieldsets/assignDependentInputsToRadioGroup';
import M52StylizedOption from 'app/component/molecule/m52-stylized-option/M52StylizedOption.lazy';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C59MultiStepForm from 'app/component/block/c59-multi-step-form/C59MultiStepForm.lazy';
import FormEvent from 'app/component/block/c59-multi-step-form/FormEvent';
import M30TextField from 'app/component/molecule/m30-text-field/M30TextField';
import { renderTextareaForOtherOption } from 'app/util/fieldsets/renderTextareaForOtherOption';

import './o15-stylized-options.scss';

type InputEventExtended = InputEvent & {
  target: {
    checked: boolean;
  };
};
export default class O15StylizedOptions extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o15-stylized-options';

  public readonly transitionController: O15StylizedOptionsTransitionController;

  private readonly labels = this.getElements<HTMLLabelElement>('[data-label]');
  private readonly inputs = this.getElements<HTMLInputElement>('[data-stylized-input]');
  private readonly M52Elements = this.getElements(
    `[data-component="${M52StylizedOption.displayName}"]`,
  );
  private readonly M52Components: Array<M52StylizedOption> = this.M52Elements.map((element) =>
    getComponentForElement(element),
  );
  private isMultipleChoice = false;
  private readonly firstLevelOptionalTextarea = this.getElement<HTMLElement>(
    `[data-o15-optional-textarea] [data-component=${M30TextField.displayName}]`,
  );
  private readonly firstLevelOptionalDropdown = this.getElement<HTMLElement>(
    `[data-optional-select] [data-component=${M31DropdownField.displayName}]`,
  );
  private readonly firstLeveloptionalMultipleDropdown = this.getElement<HTMLElement>(
    `[data-optional-multiselect] [data-component=${O80MultiselectDropdown.displayName}]`,
  );

  private resetFirstLevelOptionalMultipleDropdown: null | (() => void) = null;
  private resetFirstLevelOptionalTextarea: null | (() => void) = null;
  private resetFirstLevelOptionalDropdown: null | (() => void) = null;
  private dependentInputs = this.getElements('[data-dependent-input-for]');
  private fieldset = this._fieldsetElement;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O15StylizedOptionsTransitionController(this);

    if (!this.inputs.length) {
      throw new Error('Could not find any inputs');
    }

    if (this.inputs[0].type === 'checkbox') {
      this.isMultipleChoice = true;
    }

    this.addEventListeners();

    if (this.firstLevelOptionalTextarea) {
      const resetFirstLevelOptionalTextArea = renderTextareaForOtherOption(
        this.firstLevelOptionalTextarea,
        this.inputs,
        this,
        this.displayName,
      );

      this.resetFirstLevelOptionalTextarea = resetFirstLevelOptionalTextArea;
    }

    if (this.firstLevelOptionalDropdown) {
      const resetFirstLevelOptionalDropdown = renderDependentDropdown(
        this.firstLevelOptionalDropdown,
        this.inputs,
        this,
        this.displayName,
      );

      this.resetFirstLevelOptionalDropdown = resetFirstLevelOptionalDropdown;
    }

    if (this.firstLeveloptionalMultipleDropdown) {
      const O80Instance = getComponentForElement<O80MultiselectDropdown>(
        this.firstLeveloptionalMultipleDropdown,
      );
      this.resetFirstLevelOptionalMultipleDropdown = renderDependentMultiChoiceDropdown(
        O80Instance,
        this.inputs,
        this,
        this.displayName,
      );
    }

    if (this.dependentInputs.length !== 0) {
      assignDependentInputsToRadioGroup(this.fieldset, this.inputs);
    }
  }

  public resetOptionalInputs() {
    this.clearCheckedClassnames();
    if (this.resetFirstLevelOptionalDropdown) {
      this.resetFirstLevelOptionalDropdown();
    }
    if (this.resetFirstLevelOptionalTextarea) {
      this.resetFirstLevelOptionalTextarea();
    }
    if (this.resetFirstLevelOptionalMultipleDropdown) {
      this.resetFirstLevelOptionalMultipleDropdown();
    }
    this.resetSecondLevelOptionalDropdowns();
  }

  private addEventListeners(): void {
    this.inputs.forEach((input, index) => {
      if (input) {
        this.addDisposableEventListener(input, 'change', (event: InputEventExtended) =>
          this.isMultipleChoice
            ? this.onMultipleChoiceInputChange(event, index)
            : this.onSingleChoiceInputChange(event, index),
        );
      } else {
        throw new Error('Could not find input in o15');
      }
    });
  }

  private onMultipleChoiceInputChange(event: InputEventExtended, index: number): void {
    const label = this.labels[index];
    if (event.target) {
      label.classList.toggle(StateClassNames.CHECKED, event.target.checked);
    } else {
      throw new Error('Could not locate event target input in o15');
    }

    this.notifyCheckboxAboutCheckedStateChange(index, event.target.checked);
  }

  private onSingleChoiceInputChange(event: InputEventExtended, index: number): void {
    if (event.target.checked) {
      updateClassForItems({
        removeFrom: this.labels,
        addToOne: this.labels[index],
        className: StateClassNames.CHECKED,
      });

      this.notifyRadiosAboutCheckedStateChange(index);
    } else {
      throw new Error('Could not locate event target input in o15');
    }
  }

  private notifyRadiosAboutCheckedStateChange(selectedRadioIndex: number) {
    this.M52Components.forEach((radioComponent, radioComponentIndex) =>
      radioComponentIndex !== selectedRadioIndex
        ? radioComponent.onUncheck()
        : radioComponent.onCheck(),
    );
  }

  private notifyCheckboxAboutCheckedStateChange(selectedCheckboxIndex: number, isChecked: boolean) {
    const checkboxComponent = this.M52Components[selectedCheckboxIndex];
    isChecked ? checkboxComponent.onCheck() : checkboxComponent.onUncheck();
  }

  private resetSecondLevelOptionalDropdowns() {
    this.M52Components.forEach((component) => component.onUncheck());
  }

  private clearCheckedClassnames() {
    this.labels.forEach((label) => label.classList.remove(StateClassNames.CHECKED));
  }

  private get _parentForm() {
    const c59Instance = this.getClosestComponent<C59MultiStepForm>(
      `${C59MultiStepForm.displayName}`,
    );

    return c59Instance;
  }

  public adopted() {
    setAsInitialised(this.element);
    this.setupParentFormListeners();
  }

  private setupParentFormListeners() {
    const parentForm = this._parentForm;

    if (parentForm) {
      this.addDisposableEventListener(parentForm.dispatcher, FormEvent.RESET, () => {
        this.resetOptionalInputs();
      });
    }
  }

  private get _fieldsetElement() {
    const fieldset = this.getElement<HTMLFieldSetElement>('[data-fieldset]');

    if (!fieldset) {
      throw new Error('No fieldset element found');
    }

    return fieldset;
  }
}
