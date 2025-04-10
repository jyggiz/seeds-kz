import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import { CheckboxItem, RadioItem } from 'app/data/type/Form.types';
import { M31DropdownFieldProps } from '../m31-dropdown-field/M31DropdownField.types';

export type M52StylizedOptionProps<T extends CheckboxItem | RadioItem> = T & {
  image: A01ImageProps;
  dependentDropdown?: {
    componentName: 'm31-dropdown-field';
    data: M31DropdownFieldProps;
  };
};
