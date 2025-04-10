import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import { O63ColorSwatchProps } from 'app/component/organism/o63-color-swatch/O63ColorSwatch.types';

export type C66ColorSwatchesProps = {
  id?: string;
  scrollComponent?: boolean;
  hading: A03HeadingProps;
  description: string;
  colors: {
    color: O63ColorSwatchProps;
  };
  colorRatio?: {
    tabsCopy?: string;
    tag?: string;
  };
};
