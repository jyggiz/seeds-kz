import { A14InputProps } from 'app/component/atom/a14-input/A14Input.types';

type ButtonAria = {
  label: string;
  controls?: string;
};

export type O88SearchBarProps = {
  scrollComponent?: boolean;
  fullWidth?: boolean;
  id?: string;
  placeholder: Pick<A14InputProps, 'placeholder'>;
  inputId: Pick<A14InputProps, 'id'>;
  searchButtonAria?: ButtonAria;
  closeButtonAria?: ButtonAria;
};
