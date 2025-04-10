import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { O94SocialMediaProps } from '../../organism/o94-social-media/O94SocialMedia.types';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';

export type C102SocialMediaProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  social: O94SocialMediaProps;
  background: M34ComponentBackgroundProps;
  backgroundPosition?: 'top' | 'bottom'; //default to 'top'
  divider?: 'fullWidth' | 'withPadding' | 'none'; //default to none
};
