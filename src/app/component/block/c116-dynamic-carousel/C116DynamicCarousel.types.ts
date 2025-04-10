import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { O82GenericSliderProps } from '../../organism/o82-generic-slider/O82GenericSlider.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type C116DynamicCarouselProps = {
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  backgroundColor: Omit<NeomThemeBackgroundColors, 'green' | 'dark-blue'>;
  background?: M34ComponentBackgroundProps;
  slider: O82GenericSliderProps;
  buttons: Array<M02ButtonProps>;
  theme?: Omit<NeomComponentThemes, 'lightOxagonBlue'>;
};
