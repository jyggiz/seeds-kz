import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { BlockPaddingOptions } from 'app/data/type/BlockPaddings';
import { M46MediaCardProps } from '../../molecule/m46-media-card/M46MediaCard.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C64NewsListProps = {
  header: M04ComponentHeaderProps;
  id?: string;
  padding?: BlockPaddingOptions;
  theme?: NeomComponentThemes;
  backgroundColor?: NeomThemeBackgroundColors;
  items: Array<M46MediaCardProps>;
  scrollComponent?: boolean;
};
