import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';

export type O103CircleItem = {
  href: string;
  target?: '_blank' | '_self';
  image: A01ImageProps;
  title: string;
  background?: M34ComponentBackgroundProps;
};

export type O103CirclesGridProps = {
  id?: string;
  scrollComponent?: boolean;
  data?: Record<string, string>;
  items: ReadonlyArray<O103CircleItem>;
};
