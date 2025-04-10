import AbstractComponent from 'app/component/AbstractComponent';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { isElementVisibleInContainer } from 'app/util/enterViewportUtils';
import { DisposableManager } from 'seng-disposable-manager';
import {
  FormField,
  ValidationResult,
  validateFields,
  isFieldSet,
} from 'app/util/form-validation/validateJSHelpers';
// CONFIG START
const textFieldTypes: ReadonlyArray<string> = ['text', 'email', 'textarea'];
const optionGroupTypes: ReadonlyArray<string> = [
  'checkbox',
  'radio',
  'select-one',
  'select-multiple',
];
const stepContainerIdentifier = '[data-slider-container]';
const errorNodeIdentifier = '[data-error-message]';
const typesOfInputsToValidate = `input[data-validate]:not([data-block-validation]), fieldset[data-validate]:not([data-block-validation]), 
  select[data-validate]:not([data-block-validation]), textarea[data-validate]:not([data-block-validation])`;

// CONFIG END

export type ControlEventHandler = (event: Event) => Promise<void> | void;

/**
 * Use to add validation to a stepped form.
 * Apart from the arguments passed to function, change the config above
 * to customize the validation.
 * @param {ReadonlyArray<HTMLElement>} steps - The steps of the form.
 * @param {AbstractComponent} Component - The form component.
 * @returns {withStepValidation} - Higher order function that should wrap the callback functions
 * that are invoked when moving to the next step of the form or attempting to submit. Will validate the step before allowing the callback to run.
 * @returns {updateStepToValidate} - Function that should be invoked in the form component when the state of the active step changes. Otherwise,
 * the validation logic will fail to validate the correct step.
 */

export const addStepFormValidation = (
  steps: ReadonlyArray<HTMLElement>,
  Component: AbstractComponent,
) => {
  const stepContainer = Component.getElement(stepContainerIdentifier);
  if (!stepContainer) {
    throw new Error('Could not find step container element in step form validation module');
  }
  let activeStep = 0;
  const ValidationDisposablesManager = new DisposableManager();

  const withStepValidation = (handler: ControlEventHandler) => {
    return (event: Event) => {
      if (activeStep == null) {
        throw new Error('Could not find active step index');
      }

      const stepSection = steps[activeStep];

      // setup listeners again to include optionally validated inputs that might
      // have been activated by user choices (eg. textarea, dropdown)
      setupValidationOnFieldChange(stepSection, Component, ValidationDisposablesManager);

      const inputsToValidate = getinputsToValidate(stepSection, Component);
      const errorNodes = Component.getElements(errorNodeIdentifier, stepSection);

      const stepValidationResult = validateFields(...inputsToValidate);
      toggleStepErrors(inputsToValidate, errorNodes, stepValidationResult, stepContainer);

      const isStepValid = !stepValidationResult;

      if (isStepValid) {
        stepContainer.scrollTop = 0;
        handler.bind(Component)(event);
      }
    };
  };

  const updateStepToValidate = (stepIndex: number) => {
    const stepSection = steps[stepIndex];

    setupValidationOnFieldChange(stepSection, Component, ValidationDisposablesManager);

    activeStep = stepIndex;
  };

  updateStepToValidate(0);
  return { withStepValidation, updateStepToValidate };
};

const setupValidationOnFieldChange = (
  stepSection: HTMLElement,
  Component: AbstractComponent,
  disposablesManager: DisposableManager,
) => {
  disposablesManager.dispose();

  const inputsToValidate = getinputsToValidate(stepSection, Component);
  const errorNodes = Component.getElements(errorNodeIdentifier, stepSection);
  if (!errorNodes.length) throw new Error('Step errors not found in step validation module');

  if (!inputsToValidate) throw new Error('Step fields not found');

  const textFields = inputsToValidate.filter((field) =>
    textFieldTypes.includes(field.type),
  ) as ReadonlyArray<HTMLInputElement>;

  const optionGroups = inputsToValidate.filter((field) =>
    optionGroupTypes.includes(field.type),
  ) as ReadonlyArray<HTMLInputElement>;

  const fieldsets = inputsToValidate.filter((field) => isFieldSet(field)) as HTMLFieldSetElement[];

  if (textFields) {
    textFields.forEach((textField) => {
      Component.addDisposableEventListener(
        textField,
        'blur',
        () => validateFieldOnChange(textField, errorNodes),
        disposablesManager,
      );
    });
  }

  if (fieldsets) {
    fieldsets.forEach((fieldset) => {
      Component.addDisposableEventListener(
        fieldset,
        'change',
        () => validateFieldOnChange(fieldset, errorNodes),
        disposablesManager,
      );
    });
  }

  if (optionGroups) {
    optionGroups.forEach((optionGroup) => {
      Component.addDisposableEventListener(
        optionGroup,
        'change',
        () => validateFieldOnChange(optionGroup, errorNodes),
        disposablesManager,
      );
    });
  }
};

const validateFieldOnChange = (
  field: HTMLInputElement | HTMLFieldSetElement,
  errors: ReadonlyArray<HTMLElement>,
) => {
  if (isFieldSet(field)) {
    const result = validateFields(field);
    toggleError(errors, field, result);
  } else {
    if (field.value === '') {
      toggleError(errors, field, undefined);
      return;
    }

    const result = validateFields(field);
    toggleError(errors, field, result);
  }
};

const getinputsToValidate = (step: HTMLElement, Component: AbstractComponent) => {
  return Component.getElements(typesOfInputsToValidate, step) as Array<FormField>;
};

const toggleStepErrors = (
  inputsToValidate: Array<FormField>,
  errorNodes: ReadonlyArray<HTMLElement>,
  validationResult: ValidationResult,
  stepContainer: HTMLElement,
) => {
  if (errorNodes.length === 0) throw new Error('Step errors not found');

  let firstFieldErrorIsInView = false;

  inputsToValidate.forEach((fieldElement) => {
    const fieldId = fieldElement.id;

    const fieldErrorElement = errorNodes.find(
      (errorElement) => errorElement.dataset.for === fieldId,
    );

    if (!fieldErrorElement) {
      throw new Error('Could not find field error element in step form validation module');
    }

    const isErrorFieldInView = isElementVisibleInContainer(stepContainer, fieldErrorElement);

    const scrollErrorIntoView = () => {
      fieldErrorElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
      firstFieldErrorIsInView = true;
    };

    const errorIsAlreadyInView = () => {
      firstFieldErrorIsInView = true;
    };

    toggleError(
      errorNodes,
      fieldElement,
      validationResult,
      !isErrorFieldInView && !firstFieldErrorIsInView ? scrollErrorIntoView : errorIsAlreadyInView,
    );
  });
};

const toggleError = (
  formErrors: ReadonlyArray<HTMLElement>,
  formField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFieldSetElement,
  validationResult: ValidationResult,
  setAsIntoView?: () => void,
): void => {
  const fieldId = formField.id;

  const fieldErrorElement = formErrors.find((errorElement) => errorElement.dataset.for === fieldId);

  if (!fieldErrorElement) return;

  if (!validationResult || !Object.keys(validationResult).includes(fieldId)) {
    formField.classList.remove(StateClassNames.HAS_ERROR);
    fieldErrorElement.style.margin = `-${fieldErrorElement.clientHeight}px 0px 0px 0px`;
    // cannot use display none, as it breaks the functionality in addStepFormValidation util
    // that scrolls errors into view if they are not
    fieldErrorElement.style.visibility = 'hidden';
    return;
  }

  const [errorMessage] = validationResult[fieldId];

  if (errorMessage) {
    formField.classList.add(StateClassNames.HAS_ERROR);
    fieldErrorElement.style.visibility = 'visible';
    fieldErrorElement.style.margin = `initial`;
    fieldErrorElement.innerText = errorMessage;
  }

  if (setAsIntoView) {
    setAsIntoView();
  }
};
