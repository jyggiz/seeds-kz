import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';

export type C117FlipCardsProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  theme?: NeomComponentThemes;
  id?: string;
  scrollComponent?: boolean;

  header?: M04ComponentHeaderProps;
  description?: {
    text: string;
    size?: 'small' | 'medium' | 'large';
  };

  items: ReadonlyArray<{
    title: string; // char limit 25
    copy: string;
    icon?: string;
    image: A01ImageProps;
    expandCtaAria?: {
      label?: string;
      controls?: string;
    };
    closeCtaAria?: {
      label?: string;
      controls?: string;
    };
  }>;
};
