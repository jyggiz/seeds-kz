import { A15SelectProps } from '../../atom/a15-select/A15Select.types';

export type M59DynamicDropdownProps = A15SelectProps & {
  mapValues: M59MapValue;
};

export type M59MapValue = {
  fieldName: string;
  map: Array<{ key: string; value: Array<string> }>;
};
