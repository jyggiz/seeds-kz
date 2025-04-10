import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C47MotionBannerVariant = 'beachGames';

export type C47MotionBannerProps = {
  id?: string;
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  padding?: BlockComponentPadding;
  backgroundColor?: NeomThemeBackgroundColors;
  theme?: NeomComponentThemes;
  /**
   * C47 has the ability to show a special effect on the background, this can only be enabled by setting the variant to `beachGames`.
   * */
  variant?: C47MotionBannerVariant;
  /**
   * Max 5 items allowed
   * */
  assets: ReadonlyArray<A01ImageProps>;
  logo?: A01ImageProps;
  background?: M34ComponentBackgroundProps;
};
