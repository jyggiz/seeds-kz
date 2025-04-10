import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import O30ContentGridProps from 'app/component/organism/o30-content-grid/O30ContentGrid.types';
import { M49MultipleCopyProps } from 'app/component/molecule/m49-multiple-copy/M49MultipleCopy.types';
import { NeomComponentThemes } from 'app/data/type/ComponentThemes';

type ImageItem = {
  theme?: NeomComponentThemes;
  cream?: boolean;
  image: A01ImageProps;
};

type GridContentItem = {
  theme?: NeomComponentThemes;
  cream?: boolean;
  uppercaseCopy?: boolean;
  gridContent: O30ContentGridProps;
};

type MultipleCopyItem = {
  theme?: NeomComponentThemes;
  cream?: boolean;
  multipleCopy: M49MultipleCopyProps;
};

export type C77ContentSliderProps = {
  id?: string;
  scrollComponent?: boolean;
  items: Array<ImageItem | GridContentItem | MultipleCopyItem>;
};
