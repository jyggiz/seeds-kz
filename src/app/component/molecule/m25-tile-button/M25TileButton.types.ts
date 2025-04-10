import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';
import { TextTransform } from 'app/data/type/TextTransformations';

export type M25TileButtonProps = {
  variant?: 'previous' | 'next';
  theme?: NeomComponentThemes;
  icon: string;
  transform?: TextTransform;
  heading: {
    text: string;
  };
  link: {
    href: string;
    target?: '_blank' | '_self';
  };
  image?: A01ImageProps;
};
