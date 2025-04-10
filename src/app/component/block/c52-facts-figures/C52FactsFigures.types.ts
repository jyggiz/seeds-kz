import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { O58FactsListProps } from '../../organism/o58-facts-list/O58FactsList.types';

export type C52FactsFiguresProps = {
  id?: string;
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  theme?: NeomComponentThemes;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  background: M34ComponentBackgroundProps;
  header?: M04ComponentHeaderProps;
  items: Array<O58FactsListProps>;
};
