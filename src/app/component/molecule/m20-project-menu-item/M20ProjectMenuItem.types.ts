import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { LinkProps } from '../../../data/interface/LinkProps';

export type M20ProjectMenuItemProps = {
  variant?: 'dropdown' | 'panel';
  image: A01ImageProps;
  link: LinkProps;
};
