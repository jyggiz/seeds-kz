import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { getComponentForElement } from 'muban-core';
import C96NewsletterSubscriptionTransitionController from './C96NewsletterSubscriptionTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import O45Form from '../../organism/o45-form/O45Form.lazy';
import O45FormEvent from '../../organism/o45-form/O45FormEvent';
import { TweenLite } from 'gsap';
import eases from '../../../animation/eases';
import { ValidationConstraint } from '../../organism/o45-form/O45FormValidationTypes';
import {
  getValidationConstraints,
  validateField,
  validateForm,
} from '../../organism/o45-form/O45FormValidation';

import './c96-newsletter-subscription.scss';

export default class C96NewsletterSubscription extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c96-newsletter-subscription';

  public readonly transitionController: C96NewsletterSubscriptionTransitionController;

  private readonly formWrapper = this.getElement('[data-form-wrapper]');
  readonly responseWrapper = this.getElement('[data-response-wrapper]');

  private readonly formElement = this.getElement(`[data-component="${O45Form.displayName}"]`);
  private formComponent: O45Form | null = null;

  private readonly submitButton = this.getElement<HTMLButtonElement>('button');
  private readonly inputField = this.getElement<HTMLInputElement>('.a-input__input');
  private formErrors = this.getElements('[data-error-message]');
  private readonly form = this.getElement<HTMLFormElement>('[data-form]');
  private readonly formResponseWrapper = this.getElement<HTMLDivElement>(
    '[data-form-response-wrapper]',
  );

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C96NewsletterSubscriptionTransitionController(this);

    if (this.inputField) {
      const validationConstraints = getValidationConstraints([this.inputField]);
      this.onInputValueChange('input', this.inputField, validationConstraints, this.formErrors);
    }
  }

  public adopted() {
    setAsInitialised(this.element);

    if (this.formElement) {
      this.formComponent = getComponentForElement<O45Form>(this.formElement);

      this.addDisposableEventListener<O45FormEvent>(
        this.formComponent.dispatcher,
        O45FormEvent.UPDATE,
        this.onFormResponded.bind(this),
      );
    }
  }

  private onFormResponded(): void {
    this.formWrapper?.classList.add(StateClassNames.HIDDEN);
    this.responseWrapper?.classList.remove(StateClassNames.HIDDEN);

    TweenLite.fromTo(
      this.responseWrapper,
      0.5,
      {
        height: 0,
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        height: this.responseWrapper?.offsetHeight,
        ease: eases.VinnieInOut,
      },
    );
  }

  private onInputValueChange(
    listener: string,
    field: HTMLInputElement,
    validationConstraints: ValidationConstraint,
    formErrors: ReadonlyArray<HTMLElement>,
  ) {
    this.addDisposableEventListener(field, listener, () => {
      this.toggleSubmitButtonDisabledStatus(false);

      if (formErrors[0].style.display === 'block') {
        validateField(field, validationConstraints, formErrors);
        const result = validateForm(this.form!, validationConstraints);
        this.toggleSubmitButtonDisabledStatus(!!result);
      }

      if (this.formResponseWrapper && this.formResponseWrapper?.offsetHeight > 0) {
        TweenLite.to(this.formResponseWrapper, 0.5, {
          autoAlpha: 0,
          height: 0,
          ease: eases.VinnieInOut,
        });
      }

      if (!this.inputField?.value) {
        this.inputField?.classList.remove(StateClassNames.HAS_ERROR);
        formErrors[0].style.display = 'none';
      }
    });
  }

  private toggleSubmitButtonDisabledStatus(isDisabled: boolean) {
    if (!this.submitButton) return;

    this.submitButton.disabled = isDisabled;
  }
}
