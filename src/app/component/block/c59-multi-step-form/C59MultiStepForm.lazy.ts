import AbstractComponent from 'app/component/AbstractComponent';
import Swiper from 'swiper';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getAppComponent } from '../../../util/getElementComponent';
import TrackingEvent, { TrackingEventNames } from '../../../util/TrackingEvent';
import App from '../../layout/app/App';
import O48LoadingSpinner from '../../organism/o48-loading-spinner/O48LoadingSpinner';
import { DisposableManager } from 'seng-disposable-manager';
import { getCurrentLanguageCode } from 'app/util/getCurrentLanguageCode';
import { post } from 'app/util/fetch/postRequest';
import { FetchError } from 'app/util/fetch/fetchError';
import A24ProgressBar from 'app/component/atom/a24-progress-bar/A24ProgressBar';
import { updateClassForItems } from 'app/util/stateClassNamesToggle';
import O73SubmitStep from 'app/component/organism/o73-submit-step/O73SubmitStep.lazy';
import { addStepFormValidation, ControlEventHandler } from './addStepFormValidation';
import { setVisibility } from '../../../util/setVisibility';
import { observeMultipleElementsResize } from '../../../util/observeMultipleElementsResize';
import M34ComponentBackground from '../../molecule/m34-component-background/M34ComponentBackground';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { RecaptchaUtils } from '../../../util/RecaptchaUtils';
import FormEvent, { FormEventType } from './FormEvent';
import { ConditionalStep } from './C59MultiStepForm.types';
import FormStep from './component/organism/form-step/FormStep';
import { CONTACT_PERMISSION_FIELD } from 'app/data/form/fields';
import { getIntent } from 'app/util/form/getIntent';

import './c59-multi-step-form.scss';

interface FormApiResponse {
  message: string;
  status: 200 | 400;
}

export default class C59MultiStepForm extends AbstractComponent {
  public static readonly displayName: string = 'c59-multi-step-form';

  private app!: App;
  private isDeviceStateEqualOrLessThanMedium =
    deviceStateTracker.currentDeviceState.state <= mq.deviceState.MEDIUM;

  // swiper
  private swiperSlider: Swiper | undefined = undefined;
  private readonly slider = this.getElementOrThrowError('[data-slider]');
  private readonly steps = this.getElements('[data-slider-item]');
  private activeStep: number = 0;

  private readonly recaptchaUtils: RecaptchaUtils | null = null;

  // controls
  private controlsButtons = {
    next: this.getElementOrThrowError('[data-next-button]'),
    previous: this.getElementOrThrowError('[data-previous-button]'),
    submit: this.getElementOrThrowError('[data-submit-button]'),
  };
  private submitViewButtons = {
    done: this.getElementOrThrowError('[data-done-button]'),
    retry: this.getElementOrThrowError('[data-retry-button]'),
  };
  private readonly controlEventsDisposableManager: DisposableManager;
  private readonly progressBar = this.getElementOrThrowError(
    `[data-component="${A24ProgressBar.displayName}"]`,
  );

  // form
  private readonly form = this.getElementOrThrowError<HTMLFormElement>('[data-form]');
  private loadingSpinner: HTMLElement | null = null;
  private readonly formIdInput = this.getElementOrThrowError<HTMLInputElement>('[name="form_id"]');
  private readonly stepHeaders = this.getElements('[data-form-step-legend]');
  private readonly formContainer = this.getElementOrThrowError('[data-form-container]');
  private readonly sliderContainer = this.getElement('[data-slider-container]');
  private readonly controls = this.getElement('[data-form-controls]');
  private readonly conditionalStep = this.element.dataset.conditionalStep
    ? (JSON.parse(this.element.dataset.conditionalStep) as ConditionalStep)
    : null;
  private conditionalStepIndex: number | null = null;
  private readonly componentBackground = this.getElements(
    `[data-component="${M34ComponentBackground.displayName}"]`,
  );
  private stepContainers = this.getElements('.o-formStep__container');
  private readonly formSteps = this.getComponents<FormStep>(FormStep.displayName);

  //submit view
  private readonly submitView = this.getElementOrThrowError(
    `[data-component="${O73SubmitStep.displayName}"]`,
  );
  private readonly submitSuccess = this.getElementOrThrowError('[data-submit-success]');
  private readonly submitError = this.getElementOrThrowError('[data-submit-error]');

  // validation
  private withStepValidation: ((handler: ControlEventHandler) => (event: Event) => void) | null =
    null;
  private updateStepToValidate: ((stepIndex: number) => void) | null = null;

  // resize observer
  private unobserveMultipleElementsResize = observeMultipleElementsResize(this.stepContainers, () =>
    this.swiperSlider?.updateAutoHeight(),
  );

  constructor(el: HTMLElement) {
    super(el);

    this.controlEventsDisposableManager = new DisposableManager();

    this.initSlider();

    const { withStepValidation, updateStepToValidate } = addStepFormValidation(this.steps, this);

    this.withStepValidation = withStepValidation;
    this.updateStepToValidate = updateStepToValidate;

    if (this.element.dataset.sitekey)
      this.recaptchaUtils = new RecaptchaUtils(this.element.dataset.sitekey);

    this.setComponentHeightTo100vh();
  }

  private getElementOrThrowError<T extends HTMLElement>(selector: string) {
    const element = this.getElement<T>(selector);

    if (!element) {
      throw new Error(
        `Could not find element with ${selector} selector in ${C59MultiStepForm.displayName}`,
      );
    }

    return element;
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.app = await getAppComponent();

    this.loadingSpinner = this.app.getElement(
      `[data-component="${O48LoadingSpinner.displayName}"]`,
    );

    this.form.setAttribute('novalidate', '');

    this.addControlsEventListeners();

    this.toggleButtonsForStep(this.activeStep);

    setVisibility(false, this.submitView);

    this.trackFormFunnel(this.activeStep);
  }

  private initSlider(): void {
    if (this.slider) {
      this.swiperSlider = new Swiper(this.slider, {
        direction: 'horizontal',
        allowTouchMove: false,
        loop: false,
        slidesPerView: 1,
        autoHeight: true,
        spaceBetween: 0,
        preventClicks: false,
      });
    }
  }

  // CONTROLS
  private onNextStep(): void {
    if (!this.swiperSlider) throw new Error('Swiper instance not found');
    const swiper = this.swiperSlider;

    if (this.conditionalStep) {
      const formData = new FormData(this.form);
      const formValues = Array.from(formData.values());

      this.conditionalStepIndex = formValues.includes(this.conditionalStep.valueToMatch)
        ? null
        : this.conditionalStep.stepNumber - 1;
    }

    // IF THE NEXT STEP IS CONDITIONAL THEN SKIP IT
    if (this.conditionalStepIndex && swiper.activeIndex + 1 === this.conditionalStepIndex) {
      swiper.slideTo(swiper.activeIndex + 2);
      this.activeStep += 2;
    } else {
      swiper.slideNext();
      this.activeStep += 1;
    }

    this.updateStepState(this.activeStep);
  }

  private onPreviousStep(): void {
    if (!this.swiperSlider) throw new Error('Swiper instance not found');
    const swiper = this.swiperSlider;

    // IF THE PREV STEP IS CONDITIONAL THEN SKIP IT
    if (this.conditionalStepIndex && swiper.activeIndex - 1 === this.conditionalStepIndex) {
      swiper.slideTo(swiper.activeIndex - 2);
      this.activeStep -= 2;
    } else {
      swiper.slidePrev();
      this.activeStep -= 1;
    }

    this.updateStepState(this.activeStep);
  }

  private updateStepState(step: number) {
    if (!this.updateStepToValidate) {
      throw new Error(`Could not find updateStepToValidate function`);
    }
    this.toggleButtonsForStep(step);
    this.trackProgress(step);
    this.updateStepHeading(step);
    this.updateStepToValidate(step);
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

  private async submitForm(): Promise<void> {
    this.trackFormFunnel(this.activeStep + 1);

    const form = this.form;

    const formData = new FormData(form);

    const formID = this.formIdInput.value;

    const { apiUrl } = form.dataset;
    const { titleInEnglish } = this.element.dataset;

    if (!titleInEnglish) throw new Error('Form title in english is not set');
    if (!apiUrl) throw new Error('Form api url was not found');
    if (!this.loadingSpinner) throw new Error('Loading spinner was not found');

    try {
      await this.loadRecaptcha();
    } catch (error) {
      console.log(error);
    }

    if (!this.recaptchaUtils) throw new Error('Recaptcha sitekey was not found');

    this.loadingSpinner.classList.add(StateClassNames.WITH_BACKGROUND);

    await this.app.setLoadingState(true);

    try {
      const recaptchaResponse = await this.recaptchaUtils.executeRecaptcha();

      formData.set('g-recaptcha-response', recaptchaResponse);

      const response = await post(apiUrl, formData);
      const { message, status }: FormApiResponse = await response.json();
      const isError = status === 400;

      this.app.setLoadingState(false);

      if (!isError) {
        const contactPermissions = formData.get(CONTACT_PERMISSION_FIELD);

        TrackingEvent({
          event: TrackingEventNames.GENERATE_LEAD,
          form: {
            form_id: formID,
            form_name: titleInEnglish,
            form_intent: getIntent(),
            form_error_message: null,
          },
          response: {
            message,
            status,
          },
          user: {
            form_id: formID,
            lang_code: getCurrentLanguageCode(),
            contact_permissions: contactPermissions ? String(contactPermissions) : null,
            email: formData.get('email')?.toString() || '',
            g_recaptcha_response: recaptchaResponse,
          },
        });
      } else {
        this.trackFormError(formID, titleInEnglish, this.activeStep, message);
      }

      this.showSubmitResult('success');
    } catch (err) {
      this.app.setLoadingState(false);
      this.showSubmitResult('error');

      if (err instanceof FetchError) {
        this.trackFormError(formID, titleInEnglish, this.activeStep, err.message);
        throw new Error(`${err.message} Response status: ${err.status}`);
      } else {
        this.trackFormError(formID, titleInEnglish, this.activeStep, err as string);
        throw new Error(err as string);
      }
    }
  }

  private addControlsEventListeners(): void {
    const attachEventListener = (element: HTMLElement, handler: ControlEventHandler) => {
      this.addDisposableEventListener(
        element,
        'click',
        handler,
        this.controlEventsDisposableManager,
      );
    };

    [...Object.values(this.controlsButtons), ...Object.values(this.submitViewButtons)].forEach(
      (button) => {
        if (button) {
          const isPreviousBtn = button.hasAttribute('data-previous-button');
          const isNextBtn = button.hasAttribute('data-next-button');
          const isSubmitBtn = button.hasAttribute('data-submit-button');
          const isRetryBtn = button.hasAttribute('data-retry-button');

          if (!this.withStepValidation) {
            throw new Error(`Could not find withStepValidation function`);
          }

          if (isPreviousBtn) attachEventListener(button, this.onPreviousStep.bind(this));
          if (isNextBtn) attachEventListener(button, this.withStepValidation(this.onNextStep));
          if (isSubmitBtn) attachEventListener(button, this.withStepValidation(this.submitForm));
          if (isRetryBtn) attachEventListener(button, this.resetForm.bind(this));
        }
      },
    );
  }

  private toggleButtonsForStep(step: number): void {
    if (this.steps.length === 1) {
      setVisibility(false, this.controlsButtons.next, this.controlsButtons.previous);
      setVisibility(true, this.controlsButtons.submit);
      return;
    }
    switch (step) {
      case 0:
        {
          setVisibility(true, this.controlsButtons.next);
          setVisibility(false, this.controlsButtons.previous, this.controlsButtons.submit);
        }
        break;
      case this.steps.length - 1:
        {
          setVisibility(true, this.controlsButtons.previous, this.controlsButtons.submit);
          setVisibility(false, this.controlsButtons.next);
        }
        break;
      default:
        setVisibility(true, this.controlsButtons.previous, this.controlsButtons.next);
        setVisibility(false, this.controlsButtons.submit);
    }
  }

  private updateStepHeading(step: number) {
    if (!this.stepHeaders.length) {
      throw new Error('No step headers were found');
    }
    updateClassForItems({
      removeFrom: this.stepHeaders,
      addToOne: this.stepHeaders[step],
      className: StateClassNames.ACTIVE,
    });
  }

  private showSubmitResult(response: 'success' | 'error') {
    setVisibility(true, this.submitView);
    setVisibility(false, this.formContainer);
    const doneButton = this.submitViewButtons.done;
    const retryButton = this.submitViewButtons.retry;

    if (response === 'success') {
      setVisibility(true, this.submitSuccess, doneButton);
      setVisibility(false, this.submitError, retryButton);
    } else {
      setVisibility(false, this.submitSuccess, doneButton);
      setVisibility(true, this.submitError, retryButton);
    }
  }

  // TRACKING

  private updateProgressBar(step: number): void {
    if (!this.progressBar) {
      throw new Error('Progress bar component not found');
    }

    this.progressBar.style.setProperty(
      '--progress-bar-current',
      `${((step + 1) / this.steps.length) * 100}%`,
    );
  }

  private setComponentHeightTo100vh() {
    if (
      this.componentBackground &&
      this.controls &&
      this.sliderContainer &&
      this.isDeviceStateEqualOrLessThanMedium
    ) {
      this.sliderContainer.style.height = `calc((var(--vh) * 100) - ${this.componentBackground[1].offsetHeight}px - ${this.controls.offsetHeight}px)`;
    }

    if (this.controls && this.sliderContainer && !this.isDeviceStateEqualOrLessThanMedium) {
      this.sliderContainer.style.height = `calc((var(--vh) * 100) - ${this.controls.offsetHeight}px)`;
    }

    this.formSteps.forEach((formStep) => {
      formStep.updateHeight(this.sliderContainer?.clientHeight || 0);
    });
  }

  private trackProgress(step: number): void {
    this.trackFormFunnel(step);
    this.updateProgressBar(step);
  }

  private trackFormFunnel(step: number): void {
    const titleInEnglish: string | undefined = this.form?.dataset.titleInEnglish;

    TrackingEvent({
      event: TrackingEventNames.FORM_FUNNEL,
      step: step + 1,
      form: {
        titleInEnglish: titleInEnglish ? titleInEnglish : '',
      },
    });
  }

  private trackFormError(
    formID: string,
    formName: string,
    step: number,
    errorMessage: string,
  ): void {
    TrackingEvent({
      event: TrackingEventNames.FORM_ERROR,
      form_id: formID,
      form_name: formName,
      form_intent: getIntent(),
      form_step: step + 1,
      form_error: true,
      form_error_message: errorMessage,
    });
  }

  private resetForm(event: Event) {
    event.preventDefault();

    this.form.reset();

    this.emitFormEvent(FormEvent.RESET);

    if (!this.swiperSlider) throw new Error('Swiper instance not found');

    this.swiperSlider.slideTo(0);

    this.activeStep = 0;

    setVisibility(false, this.submitView);
    this.formContainer.style.display = 'flex';

    this.updateStepState(this.activeStep);
  }

  private emitFormEvent(event: FormEventType) {
    this.dispatcher.dispatchEvent(new FormEvent(event));
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isDeviceStateEqualOrLessThanMedium = state <= mq.deviceState.MEDIUM;

    this.setComponentHeightTo100vh();
  }

  public dispose() {
    super.dispose();
    this.controlEventsDisposableManager.dispose();
    this.unobserveMultipleElementsResize();
  }
}
