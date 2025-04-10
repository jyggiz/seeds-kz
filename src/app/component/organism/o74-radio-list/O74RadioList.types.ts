import { FormFieldSetIds } from 'app/component/block/c59-multi-step-form/component/organism/form-step/FormStep.types';
import { FormFieldsetBase, TextAreaItem } from 'app/data/type/Form.types';

export type O74RadioListProps = {
  id?: string;
  scrollComponent?: boolean;
} & FormFieldSetRadioList;

export interface FormFieldSetRadioList extends FormFieldsetBase {
  type: Extract<FormFieldSetIds, 'radio'>;
  showTextareaForOtherChoice?: TextAreaItem;
}
