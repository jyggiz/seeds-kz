import { PresenceConstraint } from 'app/data/type/Validation.types';

export type A15SelectProps = {
  autocomplete?: boolean;
  disabled?: boolean;
  placeholder?: string;
  id: string;
  items: Array<A15Item>;
  name: string;
  required?: boolean;
  titleInEnglish: string;
  validate?: PresenceConstraint;
  dataAttribute?: string;
};

export type A15Item = {
  label: string;
  selected?: boolean;
  value: string;
};
