import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { M01BlockquoteProps } from '../../molecule/m01-blockquote/M01Blockquote.types';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C51LogosProps = {
  theme?: NeomComponentThemes;
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  background: M34ComponentBackgroundProps;
  header: M04ComponentHeaderProps;
  items: Array<{
    image: A01ImageProps;
    title?: string;
    description?: string;
    href?: string;
    testimonial?: M01BlockquoteProps;
  }>;
};
