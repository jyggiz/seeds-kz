import A01ImageProps from '../../atom/a01-image/A01Image.types';
import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';

export type C63TrojenaAboutProps = {
  id?: string;
  scrollComponent?: boolean;
  theme?: NeomComponentThemes;
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockPaddingProps;
  intro: {
    background?: M34ComponentBackgroundProps;
    heading?: A03HeadingProps;
    isSingleColumn?: boolean;
    content: Array<Omit<M18ParagraphProps, 'icon' | 'eyebrow' | 'heading'>>; // content only, no additional things?
  };
  image?: A01ImageProps;
  enableTextAppearingAnimation?: boolean;
  enableImageZoomingAnimation?: boolean;
};
