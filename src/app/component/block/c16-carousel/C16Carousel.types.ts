import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { O19UpdateCardProps } from '../../organism/o19-update-card/O19UpdateCard.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C16CarouselProps = {
  theme?: NeomComponentThemes;
  header: M04ComponentHeaderProps;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  items: Array<O19UpdateCardProps>;
  scrollComponent: boolean;
  variant?: 'ctaCarousel';
};
