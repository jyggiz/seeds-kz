import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { O32GalleryCardProps } from '../../organism/o32-gallery-card/O32GalleryCard.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';

export type C114InfographicProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  theme?: NeomComponentThemes;
  lightbox?: boolean;
  items: Array<Omit<O32GalleryCardProps, 'video' | 'preview'>>;
  heading?: A03HeadingProps;
};
