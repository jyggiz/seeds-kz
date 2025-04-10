import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { O32GalleryCardProps } from '../../organism/o32-gallery-card/O32GalleryCard.types';

export type C112VideoGalleryProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  theme?: NeomComponentThemes;
  id?: string;
  scrollComponent?: boolean;
  header?: M04ComponentHeaderProps;
  items: ReadonlyArray<Omit<O32GalleryCardProps, 'variant'>>;
};
