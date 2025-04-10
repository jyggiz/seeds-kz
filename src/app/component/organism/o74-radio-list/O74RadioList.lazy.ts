import AbstractComponent from 'app/component/AbstractComponent';
import M30TextField from 'app/component/molecule/m30-text-field/M30TextField';
import { renderTextareaForOtherOption } from 'app/util/fieldsets/renderTextareaForOtherOption';

import './o74-radio-list.scss';
import C59MultiStepForm from 'app/component/block/c59-multi-step-form/C59MultiStepForm.lazy';
import { setAsInitialised } from 'app/util/setAsInitialised';
import FormEvent from 'app/component/block/c59-multi-step-form/FormEvent';
export default class O74RadioList extends AbstractComponent {
  public static readonly displayName: string = 'o74-radio-list';

  private readonly inputs = this.getElements<HTMLInputElement>('input[type="radio"]');
  private readonly optionalTextarea = this.getElement<HTMLTextAreaElement>(
    `[data-component=${M30TextField.displayName}]`,
  );

  private resetOptionalTextarea: null | (() => void) = null;

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
        O74RadioList.displayName,
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
}
