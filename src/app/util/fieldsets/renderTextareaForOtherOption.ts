import AbstractComponent from 'app/component/AbstractComponent';
import { scrollIntoViewWithDelay } from './scrollIntoViewWithDelay';

export const renderTextareaForOtherOption = (
  textareaContainer: HTMLElement,
  inputs: ReadonlyArray<HTMLInputElement | HTMLSelectElement>,
  parent: AbstractComponent,
  parentName: string,
) => {
  textareaContainer.style.display = 'none';
  const textareaElement = textareaContainer.querySelector('textarea');
  if (!textareaElement) throw new Error('Could not find textarea element');

  inputs.forEach((input) => {
    if (input) {
      parent.addDisposableEventListener(input, 'change', () => {
        setTextareaDisplayAndValidation(input);
      });
    } else {
      throw new Error(`Could not find input in ${parentName}`);
    }
  });

  const setTextareaDisplayAndValidation = (input: HTMLInputElement | HTMLSelectElement) => {
    switch (input.type) {
      case 'radio':
        {
          const radio = input as HTMLInputElement;
          radio.value === 'other' ? enableTextarea() : disableTextarea();
        }

        break;
      case 'checkbox':
        {
          const checkbox = input as HTMLInputElement;
          if (checkbox.value === 'other') {
            checkbox.checked ? enableTextarea() : disableTextarea();
          }
        }
        break;
      case 'select-one':
        {
          const select = input as HTMLSelectElement;
          select.value === 'other' ? enableTextarea() : disableTextarea();
        }
        break;
      default:
        console.log('could not match input type');
    }
  };

  const enableTextarea = () => {
    textareaContainer.style.display = 'block';
    textareaElement.removeAttribute('data-block-validation');
    textareaElement.removeAttribute('disabled');

    scrollIntoViewWithDelay(textareaElement, 100);
  };

  const disableTextarea = () => {
    textareaContainer.style.display = 'none';
    textareaElement.setAttribute('data-block-validation', '');
    textareaElement.setAttribute('disabled', '');
  };

  return () => {
    disableTextarea();
  };
};
