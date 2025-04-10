import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import m12SocialTypes from '../../molecule/m12-social/M12Social.types';
import { LinkProps } from '../../../data/interface/LinkProps';

export type C78SocialMediaTeaserBarProps = {
  id?: string;
  scrollComponent?: boolean;
  backgroundColor?: 'cream' | 'transparent';
  theme?: 'dark';
  variant?: 'swiperSize';
  padding?: BlockComponentPadding;
  heading: string;
  link: LinkProps;
  social: m12SocialTypes;
};
