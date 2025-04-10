import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C48FormsProps = {
  background?: M34ComponentBackgroundProps;
  scrollComponent?: boolean;
  theme?: NeomComponentThemes;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  variant?: 'nic';
};
