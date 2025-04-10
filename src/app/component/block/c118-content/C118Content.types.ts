import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { O100StaticGridProps } from '../../organism/o100-static-grid/O100StaticGrid.types';

export type C118ContentProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  background?: M34ComponentBackgroundProps;
  theme?: NeomComponentThemes;
  fullMinHeight: boolean;
  grid: O100StaticGridProps & { noPadding?: boolean };
};
