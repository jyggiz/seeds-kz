import AbstractComponent from 'app/component/AbstractComponent';
import M30TextField from 'app/component/molecule/m30-text-field/M30TextField';
import { renderTextareaForOtherOption } from 'app/util/fieldsets/renderTextareaForOtherOption';
import { assignDependentInputsToRadioGroup } from 'app/util/fieldsets/assignDependentInputsToRadioGroup';
import C59MultiStepForm from 'app/component/block/c59-multi-step-form/C59MultiStepForm.lazy';
import { setAsInitialised } from 'app/util/setAsInitialised';
import FormEvent from 'app/component/block/c59-multi-step-form/FormEvent';

import './o76-radio-group.scss';

export default class O76RadioGroup extends AbstractComponent {
  public static readonly displayName: string = 'o76-radio-group';

  private readonly inputs = this.getElements<HTMLInputElement>('input[type="radio"]');
  private readonly optionalTextarea = this.getElement<HTMLTextAreaElement>(
    `[data-optional-textarea] [data-component=${M30TextField.displayName}]`,
  );
  private dependentInputs = this.getElements('[data-dependent-input-for]');
  private resetOptionalTextarea: null | (() => void) = null;
  private fieldset = this._fieldsetElement;
  private readonly radioButtons = this.getElements<HTMLInputElement>(
    '[data-direct-inputs] [data-input]',
  );

  constructor(el: HTMLElement) {
    super(el);

    if (!this.inputs.length) {
      throw new Error('Could not find any inputs');
    }

    if (this.dependentInputs.length !== 0) {
      assignDependentInputsToRadioGroup(this.fieldset, this.radioButtons);
    }

    if (this.optionalTextarea) {
      this.resetOptionalTextarea = renderTextareaForOtherOption(
        this.optionalTextarea,
        this.inputs,
        this,
        O76RadioGroup.displayName,
      );
    }
  }

  public resetOptionalInputs() {
    if (this.resetOptionalTextarea) {
      this.resetOptionalTextarea();
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

  private get _fieldsetElement() {
    const fieldset = this.getElement<HTMLFieldSetElement>('[data-fieldset]');

    if (!fieldset) {
      throw new Error('No fieldset element found');
    }

    return fieldset;
  }
}
