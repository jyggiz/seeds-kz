import M04ComponentHeaderProps from 'app/component/molecule/m04-component-header/M04ComponentHeader.types';
import { A01ImageProps } from './../../atom/a01-image/A01Image.types';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { M34ComponentBackgroundProps } from './../../molecule/m34-component-background/M34ComponentBackground.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { O87TestimonialProps } from '../../organism/o87-testimonial/O87Testimonial.types';

export type C53TestimonialsProps = {
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  header: M04ComponentHeaderProps;
  padding?: BlockPaddingProps;
  theme?: NeomComponentThemes;
  backgroundColor?: NeomThemeBackgroundColors;
  background: M34ComponentBackgroundProps;
  items: Array<{
    image: A01ImageProps;
    testimonial: O87TestimonialProps;
    ariaLabel?: string;
  }>;
};
