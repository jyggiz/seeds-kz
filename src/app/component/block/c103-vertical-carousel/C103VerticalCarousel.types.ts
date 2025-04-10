import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';

export type C103VerticalCarouselProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  theme?: NeomComponentThemes;
  padding?: BlockComponentPadding;
  id?: string;
  hideInactiveSlides?: boolean;
  eyebrow?: Pick<A04EyebrowProps, 'text'>;
  scrollLabel: string;
  items: ReadonlyArray<{
    image: Pick<A01ImageProps, 'src' | 'alt' | 'sources'>;
    heading: Pick<A03HeadingProps, 'text'>;
    copy: string;
    cta?: Pick<M02ButtonProps, 'label' | 'href' | 'theme'>;
  }>;
};
