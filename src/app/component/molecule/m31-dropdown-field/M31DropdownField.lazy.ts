import AbstractComponent from 'app/component/AbstractComponent';
import C59MultiStepForm from 'app/component/block/c59-multi-step-form/C59MultiStepForm.lazy';
import FormEvent from 'app/component/block/c59-multi-step-form/FormEvent';
import { assignDependentInputsToDropdown } from 'app/util/fieldsets/assignDependentInputsToDropdown';
import { renderTextareaForOtherOption } from 'app/util/fieldsets/renderTextareaForOtherOption';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './m31-dropdown-field.scss';

export default class M31DropdownField extends AbstractComponent {
  public static readonly displayName: string = 'm31-dropdown-field';
  public readonly selectElement = this._selectElement;
  private textarea = this.getElement('[data-m31-optional-textarea]');
  public resetOptionalTextarea: (() => void) | null = null;
  private dependentInputs = this.getElements('[data-dependent-input-for]');
  private readonly select = this._select;
  private clearDependentInputs: null | (() => void) = null;

  constructor(el: HTMLElement) {
    super(el);

    if (this.dependentInputs.length !== 0) {
      this.clearDependentInputs = assignDependentInputsToDropdown(this.element, this.select);
    }

    if (this.textarea) {
      const resetOptionalTextarea = renderTextareaForOtherOption(
        this.textarea,
        [this.selectElement],
        this,
        M31DropdownField.displayName,
      );
      this.resetOptionalTextarea = resetOptionalTextarea;
    }
  }

  public clearSelection() {
    this.selectElement.value = '';
  }

  public resetOptionalInputs() {
    this.resetOptionalTextarea && this.resetOptionalTextarea();
    this.clearDependentInputs && this.clearDependentInputs();
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

  //getters
  private get _selectElement() {
    const select = this.getElement('select') as HTMLSelectElement;

    if (!select) {
      throw new Error('cannot find select element');
    }

    return select;
  }

  private get _select() {
    const selectElement = this.getElement<HTMLSelectElement>('[data-select]');

    if (!selectElement) {
      throw new Error('no select element found');
    }

    return selectElement;
  }
}
