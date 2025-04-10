import { Size } from 'app/data/enum/Size';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { O01VideoProps } from '../o01-video/O01Video.types';

type RichQuoteAuthor = {
  name: string;
  role: string;
};

type RichQuoteQuote = {
  icon: string;
  author: RichQuoteAuthor;
  quote: string;
  size?: Size; // defaults to medium
  eyebrow?: A04EyebrowProps;
};

export type O12RichQuoteProps = {
  quote: RichQuoteQuote;
  image: A01ImageProps;
  thumbnail: A01ImageProps;
  landscape?: boolean;
  button: M02ButtonProps;
} & (
  | {
      video: O01VideoProps;
    }
  | {
      link: Omit<M02ButtonProps, 'size' | 'video'>;
    }
);
