import { FormFieldSetIds } from 'app/component/block/c59-multi-step-form/component/organism/form-step/FormStep.types';
import { FormFieldsetBase } from 'app/data/type/Form.types';

export type O77InputListProps = {
  id?: string;
  scrollComponent?: boolean;
} & FormFieldSetInputList;

export interface FormFieldSetInputList extends Omit<FormFieldsetBase, 'required' | 'validate'> {
  type: Extract<FormFieldSetIds, 'grid'>;
  legend?: { text: string; variant?: 'heading' | 'subgroup' };
}
