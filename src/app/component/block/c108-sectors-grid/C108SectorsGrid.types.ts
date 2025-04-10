import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import { O103CircleItem } from '../../organism/o103-circles-grid/O103CirclesGrid.types';
import { O102CardsGridProps } from '../../organism/o102-cards-grid/O102CardsGrid.types';

type CircleGridProps = ReadonlyArray<O103CircleItem & { background?: M34ComponentBackgroundProps }>;

type Tab = {
  variant: 'sectors' | 'regions';
  eyebrow?: A04EyebrowProps;
  items: CircleGridProps | O102CardsGridProps['items'];
  maxItemsPerRow?: number; // 7 if not defined
};

export type C108SectorsGridProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  theme?: NeomComponentThemes; // light is default
  background?: M34ComponentBackgroundProps;
  header?: M04ComponentHeaderProps;
  tabs: ReadonlyArray<Tab>;
};
