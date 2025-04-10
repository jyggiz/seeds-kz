import AbstractComponent from 'app/component/AbstractComponent';
import { TweenLite } from 'gsap';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import { addEventListener } from 'seng-disposable-event-listener';
import eases from '../../../animation/eases';
import { getAppComponent } from '../../../util/getElementComponent';
import TrackingEvent, { TrackingEventNames } from '../../../util/TrackingEvent';
import O45FormResponse from './o45-form-response.hbs?include';
import { getValidationConstraints, validateField, validateForm } from './O45FormValidation';
import {
  FormErrorResponse,
  FormOptionGroup,
  FormTextField,
  Messages,
  ResponseData,
  ResponseMessage,
  ValidationConstraint,
} from './O45FormValidationTypes';
import { post } from 'app/util/fetch/postRequest';
import { FetchError } from 'app/util/fetch/fetchError';
import { RecaptchaUtils } from '../../../util/RecaptchaUtils';
import O45FormEvent from './O45FormEvent';
import { FormImpressionTrackingUtil } from '../../../util/FormImpressionTrackingUtil';
import { getCurrentLanguageCode } from 'app/util/getCurrentLanguageCode';
import { CONTACT_PERMISSION_FIELD } from 'app/data/form/fields';
import emailjs from '@emailjs/browser'

import './o45-form.scss';

export default class O45Form extends AbstractComponent {
  public static readonly displayName: string = 'o45-form';
  private readonly recaptchaUtils: RecaptchaUtils | null = null;

  private readonly _form = this.getElement<HTMLFormElement>('[data-form]');
  private readonly textFields = this.getElements<HTMLInputElement | HTMLTextAreaElement>(
    'input:not([type="hidden"])[data-validate], textarea[data-validate]',
  );
  private readonly dropDowns = this.getElements<HTMLSelectElement>('select[data-validate]');
  private readonly radiosAndCheckboxes = this.getElements<HTMLInputElement>(
    'input[type="checkbox"], input[type="radio"]',
  );
  private readonly fieldSets = this.getElements<HTMLFieldSetElement>(
    'fieldset.-radioGroup,fieldset.-checkboxGroup',
  );
  private readonly responseWrapper = this.getElement<HTMLDivElement>(
    '[data-form-response-wrapper]',
  );
  private submitButton = this.getElement<HTMLButtonElement>('[data-submit-button]');
  private readonly messages: Messages | null = this.element.dataset.messages
    ? JSON.parse(this.element.dataset.messages)
    : null;
  private readonly formErrors = this.getElements('[data-error-message]');

  private formImpressionTracking: FormImpressionTrackingUtil;
  private formTitleInEnglish = this.form.dataset.titleInEnglish || '';

  constructor(element: HTMLElement) {
    super(element);

    TweenLite.set(this.responseWrapper, {
      autoAlpha: 0,
      height: 0,
    });

    if (this.element.dataset.sitekey)
      this.recaptchaUtils = new RecaptchaUtils(this.element.dataset.sitekey);

    this.formImpressionTracking = new FormImpressionTrackingUtil(
      element,
      {
        formName: this.formTitleInEnglish,
      },
      {
        threshold: 0.5,
      },
    );

    this.toggleSubmitButtonDisabledStatus(true);
  }

  get form(): HTMLFormElement {
    if (!this._form) {
      throw new Error('No form found in a o45 template');
    }

    return this._form;
  }

  private toggleSubmitButtonDisabledStatus(isDisabled: boolean) {
    if (!this.submitButton) return;

    this.submitButton.disabled = isDisabled;
  }

  public adopted() {
    this.initValidation();

    this.formImpressionTracking.connect();
  }

  private initValidation() {
    if (!this.form) return;

    this.form.setAttribute('novalidate', '');

    const optionGroups = [...this.dropDowns, ...this.radiosAndCheckboxes] as Array<FormOptionGroup>;

    // validation constraints for optionGroups are coming from their field sets
    const validationConstraints = getValidationConstraints([
      ...this.dropDowns,
      ...this.fieldSets,
      ...this.textFields,
    ]);

    // blur and change validation
    if (this.textFields) {
      this.addEventListeners('blur', this.textFields, validationConstraints, this.formErrors);
      this.addEventListeners('input', this.textFields, validationConstraints, this.formErrors);
    }

    optionGroups &&
      this.addEventListeners('change', optionGroups, validationConstraints, this.formErrors);

    // submit validation
    this.disposables.add(
      addEventListener(this.form, 'submit', (event: Event) => this.submitForm(event)),
    );
  }

  private addEventListeners(
    listener: string,
    fields: ReadonlyArray<FormTextField> | ReadonlyArray<FormOptionGroup>,
    validationConstraints: ValidationConstraint,
    formErrors: ReadonlyArray<HTMLElement>,
  ) {
    fields.forEach((field: FormTextField | FormOptionGroup) => {
      this.addDisposableEventListener(field, listener, () => {
        validateField(field, validationConstraints, formErrors);

        const result = validateForm(this.form!, validationConstraints);

        if (!result) {
          this.toggleSubmitButtonDisabledStatus(false);
        } else {
          this.toggleSubmitButtonDisabledStatus(true);
        }
      });
    });
  }

  private loadRecaptcha() {
    return new Promise(async (resolve, reject) => {
      if (this.recaptchaUtils) {
        const recaptchaScript = await this.recaptchaUtils.loadRecaptchaScript();

        resolve(recaptchaScript);
      }

      reject('Can not find recaptcha utils / sitekey');
    });
  }

  private async submitForm(event: Event): Promise<void> {
    // Always prevent submit to avoid sending GET requests to action
    event.preventDefault();

    console.log('work')

    if (!this.form || !this.responseWrapper || !this.messages) {
      return;
    }

    console.log('here')

    const formData = new FormData(this.form);

    const formID = <string>(
      this.getElement<HTMLInputElement>('[name="form_id"]')?.getAttribute('value')
    );
    const app = await getAppComponent();

    let responseData: ResponseData = {
      error: false,
      message: null,
    };

    try {

      //const fetchRequest = post(this.form.action, formData);

      emailjs.init("K4robafSQmJqqdAsV")

      const [response] = await Promise.all([
        emailjs.sendForm("service_8hwmppb", "template_n0m0rej", this.form),
        //fetchRequest.then((response) => response.json() as unknown as ResponseMessage),
        new Promise((resolve) => {
          TweenLite.to(this.responseWrapper, 0.5, {
            autoAlpha: 0,
            height: 0,
            ease: eases.VinnieInOut,
            onComplete: resolve,
          });
        }),
      ]);

      responseData = {
        error: response.status !== 200,
        message: response.status === 200 ? this.messages.success : this.messages.error,
      };
    } catch (err) {
      const response = this.onError(err);

      responseData = response.data;

      this.trackFormError(formID, response.message.message);
    } finally {
      await app.setLoadingState(false);
      this.toggleSubmitButtonDisabledStatus(false);

      if (responseData) {
        const formResponseElement = renderItem(this.responseWrapper, O45FormResponse, responseData);
        !responseData.error &&
          this.dispatcher.dispatchEvent(new O45FormEvent(O45FormEvent.UPDATE, this));

        TweenLite.fromTo(
          this.responseWrapper,
          0.5,
          {
            height: 0,
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            height: formResponseElement.clientHeight,
            ease: eases.VinnieInOut,
          },
        );

        !responseData.error && this.form?.reset();
        this.toggleSubmitButtonDisabledStatus(true);
      }
    }
  }

  private onError(error: unknown): FormErrorResponse {
    if (!this.messages) {
      throw new Error('Please set form error and success messages');
    }

    const errorResponse = {
      data: {
        error: true,
        message: this.messages.error,
      },
      message: {
        status: 0,
        message: 'An unknown error has occurred',
      },
    };

    if (error instanceof FetchError) {
      errorResponse.message.status = error.status ?? 0;
      errorResponse.message.message = error.message ?? 'An unknown error has occurred';
      return errorResponse;
    } else {
      return errorResponse;
    }
  }

  private trackFormError(formID: string, errorMessage: string): void {
    TrackingEvent({
      event: TrackingEventNames.FORM_ERROR,
      form_id: formID,
      form_name: this.formTitleInEnglish,
      form_intent: '',
      form_step: 1,
      form_error: true,
      form_error_message: errorMessage,
    });
  }

  public onChange = (callback: (event: Event) => void) => {
    this.addDisposableEventListener(this.form, 'change', callback);
  };

  public dispose() {
    super.dispose();
    this.formImpressionTracking.disconnect();
  }
}
