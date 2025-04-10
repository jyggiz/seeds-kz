import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { O102CardsGridProps } from '../../organism/o102-cards-grid/O102CardsGrid.types';

export type C115CardsGridProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  theme?: NeomComponentThemes; // light is default
  background?: M34ComponentBackgroundProps;
  header?: M04ComponentHeaderProps;
  items: O102CardsGridProps['items'];
};
