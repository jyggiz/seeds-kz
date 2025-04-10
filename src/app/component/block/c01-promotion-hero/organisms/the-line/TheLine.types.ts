import A05MoustacheProps from '../../../../atom/a05-moustache/A05Moustache.types';
import { M02ButtonProps } from '../../../../molecule/m02-button/M02Button.types';

export type TheLineProps = {
  moustache?: A05MoustacheProps;
  buttons?: Array<M02ButtonProps>;
  logo: {
    label?: string;
    content?: string;
  };
};
