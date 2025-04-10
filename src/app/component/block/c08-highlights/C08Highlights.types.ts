import { BlockPaddingOptions } from 'app/data/type/BlockPaddings';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import M13HighlightItemProps from '../../molecule/m13-highlight-item/M13HighlightItem.types';
import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';

export type C08HighlightsProps = {
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  id?: string;
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockPaddingOptions;
  header: M04ComponentHeaderProps;
  items: Array<M13HighlightItemProps>;
  variant?: 'regular' | 'large';
  background?: M34ComponentBackgroundProps;
  description?: string;
};
