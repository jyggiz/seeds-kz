import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { O12RichQuoteProps } from '../../organism/o12-rich-quote/O12RichQuote.types';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';

export type C27RichQuoteProps = {
  overlapTopComponent?: boolean;
  scrollComponent?: boolean;
  background?: M34ComponentBackgroundProps;
  theme?: NeomComponentThemes;
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockPaddingProps;
  items: Array<O12RichQuoteProps>;
  header?: M04ComponentHeaderProps;
};
