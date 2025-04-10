import { validate } from 'validate.js';
import { ValidationType } from '../../data/type/Validation.types';

export type ValidationAttribute = {
  [fieldId: string]: string | null;
};

export type FormField =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLFieldSetElement
  | HTMLTextAreaElement;

export type ValidationConstraint = Record<string, ValidationType>;

export type ValidationResult =
  | {
      [fieldId: string]: Array<string>;
    }
  | undefined;

export type ValidationAttributes = {
  [fieldId: string]: string | null;
};

export type ValidationConstraints = Record<string, ValidationConstraint>;

export const isInput = (element: HTMLElement): element is HTMLInputElement =>
  element.nodeName === 'INPUT';

export const isSelect = (element: HTMLElement): element is HTMLSelectElement =>
  element.nodeName === 'SELECT';

export const isFieldSet = (element: HTMLElement): element is HTMLFieldSetElement =>
  element.nodeName === 'FIELDSET';

export const isTextArea = (element: HTMLElement): element is HTMLTextAreaElement =>
  element.nodeName === 'TEXTAREA';

export const validateFields = (...inputsToValidate: FormField[]): ValidationResult => {
  const validationAttributes = getValidationAttributes(...inputsToValidate);

  const validationConstraints = getValidationConstraints(...inputsToValidate);

  const validationResult: ValidationResult = validate(validationAttributes, validationConstraints);

  return validationResult;
};

export const getValidationConstraints = (...inputs: Array<FormField>) =>
  inputs.reduce((constraints, input) => {
    const { id, dataset } = input;

    const constraint = dataset.validate && JSON.parse(dataset.validate);

    return { ...constraints, [id]: constraint };
  }, {} as ValidationConstraints);

export const getValidationAttributes = (...inputs: Array<FormField>) =>
  inputs.reduce((values, input) => {
    if (isInput(input) || isSelect(input) || isTextArea(input)) {
      const elementId = input.id;

      const elementValue = input.value ? input.value : null;

      return { ...values, [elementId]: elementValue };
    } else if (isFieldSet(input)) {
      const fieldSetId = input.id;

      const fieldSetInputs = input.querySelectorAll(
        `[data-${fieldSetId}]`,
      ) as NodeListOf<HTMLInputElement>;

      const userChoice = Array.from(fieldSetInputs).find((input) => input.checked);

      return {
        ...values,
        [fieldSetId]: userChoice?.value || null,
      };
    }

    return values;
  }, {} as ValidationAttributes);
