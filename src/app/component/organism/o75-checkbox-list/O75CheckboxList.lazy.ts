import AbstractComponent from 'app/component/AbstractComponent';
import M30TextField from 'app/component/molecule/m30-text-field/M30TextField';
import M31DropdownField from 'app/component/molecule/m31-dropdown-field/M31DropdownField.lazy';
import { renderDependentDropdown } from 'app/util/fieldsets/renderDependentDropdown';
import { renderTextareaForOtherOption } from 'app/util/fieldsets/renderTextareaForOtherOption';
import { renderDependentMultiChoiceDropdown } from 'app/util/fieldsets/renderDependentMultiChoiceDropdown';
import O80MultiselectDropdown from '../o80-multiselect-dropdown/O80MultiselectDropdown.lazy';
import { getComponentForElement } from 'muban-core';
import C59MultiStepForm from 'app/component/block/c59-multi-step-form/C59MultiStepForm.lazy';
import { setAsInitialised } from 'app/util/setAsInitialised';
import FormEvent from 'app/component/block/c59-multi-step-form/FormEvent';

import './o75-checkbox-list.scss';
export default class O75CheckboxList extends AbstractComponent {
  public static readonly displayName: string = 'o75-checkbox-list';

  private readonly inputs = this.getElements<HTMLInputElement>('input[type="checkbox"]');
  private readonly optionalTextarea = this.getElement<HTMLTextAreaElement>(
    `[data-component=${M30TextField.displayName}]`,
  );

  private readonly optionalDropdown = this.getElement<HTMLElement>(
    `[data-component=${M31DropdownField.displayName}]`,
  );

  private readonly optionalMultipleDropdown = this.getElement<HTMLElement>(
    `[data-component=${O80MultiselectDropdown.displayName}]`,
  );

  private resetOptionalTextarea: null | (() => void) = null;
  private resetOptionalDropdown: null | (() => void) = null;
  private resetOptionalMultipleDropdown: null | (() => void) = null;

  constructor(el: HTMLElement) {
    super(el);

    if (!this.inputs.length) {
      throw new Error('Could not find any inputs');
    }

    if (this.optionalTextarea) {
      this.resetOptionalTextarea = renderTextareaForOtherOption(
        this.optionalTextarea,
        this.inputs,
        this,
        O75CheckboxList.displayName,
      );
    }

    if (this.optionalDropdown) {
      this.resetOptionalDropdown = renderDependentDropdown(
        this.optionalDropdown,
        this.inputs,
        this,
        O75CheckboxList.displayName,
      );
    }

    if (this.optionalMultipleDropdown) {
      const O80Instance = getComponentForElement<O80MultiselectDropdown>(
        this.optionalMultipleDropdown,
      );
      this.resetOptionalMultipleDropdown = renderDependentMultiChoiceDropdown(
        O80Instance,
        this.inputs,
        this,
        O75CheckboxList.displayName,
      );
    }
  }

  public resetOptionalInputs() {
    if (this.resetOptionalDropdown) {
      this.resetOptionalDropdown();
    }
    if (this.resetOptionalTextarea) {
      this.resetOptionalTextarea();
    }
    if (this.resetOptionalMultipleDropdown) {
      this.resetOptionalMultipleDropdown();
    }
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
}
