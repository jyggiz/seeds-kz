import { FormFieldSetIds } from 'app/component/block/c59-multi-step-form/component/organism/form-step/FormStep.types';
import {
  DependentInput,
  DependentM30,
  DependentM31,
  FormFieldsetBase,
  TextAreaItem,
} from 'app/data/type/Form.types';

export type O76RadioGroupProps = {
  id?: string;
  scrollComponent?: boolean;
} & FormFieldSetRadioGroup;

export interface FormFieldSetRadioGroup extends FormFieldsetBase {
  type: Extract<FormFieldSetIds, 'radioGroup'>;
  showTextareaForOtherChoice?: TextAreaItem;
  copy: string;
  dependentItems?: Array<DependentM30 | DependentM31>;
}
