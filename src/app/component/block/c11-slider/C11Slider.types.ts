import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { O82GenericSliderProps } from '../../organism/o82-generic-slider/O82GenericSlider.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from 'app/data/type/ComponentThemes';

export type C11SliderProps = {
  id?: string;
  scrollComponent?: boolean;
  backgroundColor: Omit<NeomThemeBackgroundColors, 'green' | 'dark-blue'>;
  padding?: BlockComponentPadding;
  background?: M34ComponentBackgroundProps;
  slider: O82GenericSliderProps;
  buttons: Array<M02ButtonProps>;
  theme?: Omit<NeomComponentThemes, 'lightOxagonBlue'>;
};
