import { M02ButtonProps } from '../../../../../molecule/m02-button/M02Button.types';

export type ChatQuoteProps = {
  title: string;
  quote: {
    text: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'; //defaults to xlarge
  };
  ctaLabel: M02ButtonProps['label'];
};
