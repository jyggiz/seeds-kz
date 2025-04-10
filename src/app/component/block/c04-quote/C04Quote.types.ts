import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { M01BlockquoteProps } from '../../molecule/m01-blockquote/M01Blockquote.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';

export type C04QuoteProps = {
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  theme?: NeomComponentThemes;
  backgroundColor?: NeomThemeBackgroundColors;
  background?: M34ComponentBackgroundProps;
  padding?: BlockPaddingProps;
  wide?: boolean;
  quote: M01BlockquoteProps;
  callToActions: Array<M02ButtonProps>;
};

export default C04QuoteProps;
