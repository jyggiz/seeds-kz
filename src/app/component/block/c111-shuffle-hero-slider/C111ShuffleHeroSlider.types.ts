import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import { O01VideoProps } from 'app/component/organism/o01-video/O01Video.types';
import { NeomThemeBackgroundColors, NeomComponentThemes } from 'app/data/type/ComponentThemes';

type ShuffleCard = {
  componentName: 'c111-slide-card';
  data: {
    slideImage: A01ImageProps;
    label: string;
    cta: M02ButtonProps;
    modalContent: {
      heading: A03HeadingProps;
      ctas: ReadonlyArray<M02ButtonProps>;
      video: O01VideoProps;
    };
  };
};

export type C111ShuffleHeroSliderProps = {
  padding?: BlockComponentPadding;
  backgroundColor?: NeomThemeBackgroundColors;
  theme: NeomComponentThemes;
  id?: string;
  scrollComponent?: boolean;
  items: ReadonlyArray<ShuffleCard>;
};
