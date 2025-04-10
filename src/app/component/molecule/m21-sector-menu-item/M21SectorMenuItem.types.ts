import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { LinkProps } from '../../../data/interface/LinkProps';

export type M21SectorMenuItemProps = {
  variant?: 'dropdown' | 'panel';
  icon: string;
  image: A01ImageProps;
  link: LinkProps;
};
