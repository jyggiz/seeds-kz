import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { O01VideoProps } from '../../organism/o01-video/O01Video.types';
type Size = 'small' | 'medium' | 'large';

export type O20BlindProps = {
  heading: {
    text: string;
  };
  description?: {
    text: string;
    size?: Size;
  };
  image: A01ImageProps;
  video?: O01VideoProps;
  textContent?: {
    items: ReadonlyArray<string>;
    size?: Size;
  };
};
