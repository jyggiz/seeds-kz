import A01ImageProps from '../../../../../atom/a01-image/A01Image.types';

export type HoverableCardProps = {
  href: string;
  target?: '_blank' | '_self';
  image: A01ImageProps;
  title: string;
  description: string;
  id?: string;
};
