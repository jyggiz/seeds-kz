import { FormFieldSetIds } from 'app/component/block/c59-multi-step-form/component/organism/form-step/FormStep.types';
import { FormFieldsetBase, TextAreaItem } from 'app/data/type/Form.types';
import { MultiSelectProps, SelectProps } from '../o15-stylized-options/O15StylizedOptions.types';

export type O75CheckboxListProps = {
  id?: string;
  scrollComponent?: boolean;
} & FormFieldSetCheckboxList;

export interface FormFieldSetCheckboxList extends FormFieldsetBase {
  type: Extract<FormFieldSetIds, 'checkbox'>;
  showTextareaForOtherChoice?: TextAreaItem;
  showDropdownForMultipleChoice?: MultiSelectProps | SelectProps;
}
