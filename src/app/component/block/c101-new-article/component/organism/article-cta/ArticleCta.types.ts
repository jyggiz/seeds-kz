import A01ImageProps from '../../../../../atom/a01-image/A01Image.types';
import { M02ButtonProps } from '../../../../../molecule/m02-button/M02Button.types';

export type ArticleCtaProps = {
  image: A01ImageProps;
  date?: string;
  heading: string;
  description: string;
  cta: Pick<M02ButtonProps, 'href' | 'label'>;
};
