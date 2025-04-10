import AbstractComponent from 'app/component/AbstractComponent';
import { isRtl } from '../../../util/rtlUtils';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import TrackingEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

import { FormImpressionTrackingUtil } from '../../../util/FormImpressionTrackingUtil';
import { getCurrentLanguageCode } from 'app/util/getCurrentLanguageCode';
import { CONTACT_PERMISSION_FIELD } from 'app/data/form/fields';

import './o08-investor-form.scss';

export default class O08InvestorForm extends AbstractComponent {
  public static readonly displayName: string = 'o08-investor-form';

  private readonly formContainer = this.getElement('[data-investor-form-container]');
  private readonly form: HTMLFormElement | null = this.getElement('[data-investor-form]');
  private readonly inputFields = this.getElements('input.required');
  private readonly submitButton = this.getElement('[data-submit-button]');
  private readonly selectFields = this.getElements('select');
  private successMessageTimeout: number | undefined;

  private formImpressionTracking: FormImpressionTrackingUtil;

  constructor(element: HTMLElement) {
    super(element);

    const isRightToLeft = isRtl();

    this.handleFormScript();
    this.handleFormSubmit();

    this.selectFields.forEach((select: HTMLElement) => {
      this.addDisposableEventListener(select, 'change', () => {
        this.handleSelectChange(select);
      });
    });

    if (isRightToLeft) {
      this.handleBlurValidation();
    }

    this.formImpressionTracking = new FormImpressionTrackingUtil(
      element,
      {
        formName: this.element.dataset.titleInEnglish || '',
      },
      {
        threshold: 0.5,
      },
    );
  }

  async adopted() {
    this.formImpressionTracking.connect();
  }

  private handleFormSubmit(): void {
    if (!this.form) {
      return;
    }

    this.addDisposableEventListener(this.form, 'submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.form!);
      const contactPermissions = formData.get(CONTACT_PERMISSION_FIELD);

      TrackingEvent({
        event: TrackingEventNames.GENERATE_LEAD,
        form: {
          form_id: 'investor_form',
          form_name: 'Investor Form',
          form_intent: '',
          form_error_message: null,
        },
        response: {
          message: '',
          status: 200,
        },
        user: {
          form_id: 'investor_form',
          lang_code: getCurrentLanguageCode(),
          contact_permissions: contactPermissions ? String(contactPermissions) : null,
          email: formData.get('email')?.toString() || '',
          g_recaptcha_response: '',
        },
      });

      this.successMessageTimeout = setTimeout(() => {
        const successMessageDisplay = this.getElement('#mce-success-response')?.style.display;

        if (successMessageDisplay !== 'none') {
          this.selectFields.forEach((select: HTMLElement) => {
            select.classList.remove(StateClassNames.SELECTED);
          });
        }
      }, 500);
    });
  }

  private handleSelectChange(selectField: any): void {
    if (selectField!.value === '') {
      selectField!.classList.remove(StateClassNames.SELECTED);
    } else {
      selectField!.classList.add(StateClassNames.SELECTED);
    }
  }

  private handleBlurValidation() {
    this.inputFields.forEach((input: any) => {
      this.addDisposableEventListener(input, 'blur', () => this.handleErrorTranslate());
    });

    this.submitButton &&
      this.addDisposableEventListener(this.submitButton, 'blur', () => this.handleErrorTranslate());
  }

  private handleErrorTranslate() {
    let inlineErrors = this.element.querySelectorAll(
      'div.mce_inline_error',
    ) as NodeListOf<HTMLElement>;

    inlineErrors.forEach((error) => {
      if (error.innerText == 'THIS FIELD IS REQUIRED.') {
        error.innerText = 'يرجى تعبئة هذا المحتوى';
      }
      if (error.innerText == 'PLEASE ENTER A VALID EMAIL ADDRESS.') {
        error.innerText = 'يرجى إدخال عنوان بريد الكتروني صحيح';
      }
    });
  }

  private handleFormScript() {
    if (!this.formContainer) {
      throw new Error('Form Container cannot be found');
    } else {
      const validationScript = document.createElement('script');
      validationScript.type = 'text/javascript';
      validationScript.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
      this.formContainer.append(validationScript);
    }
  }

  public dispose() {
    super.dispose();
    clearTimeout(this.successMessageTimeout);
    this.formImpressionTracking.disconnect();
  }
}
