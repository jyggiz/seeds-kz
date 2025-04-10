import A07LabelProps from 'app/component/atom/a07-label/A07Label.types';
import { C66ColorSwatchesProps } from '../c66-color-swatches/C66ColorSwatches.types';
import { C76ButtonReferenceProps } from '../c76-button-reference/C76ButtonReference.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';
import { C24ContentProps } from '../c24-content/C24Content.types';
import { C56FullWidthMediaProps } from '../c56-full-width-media/C56FullWidthMedia.types';

export type C60TabsProps = {
  id?: string;
  scrollComponent?: boolean;
  theme?: NeomComponentThemes;
  items: Array<{
    item: A07LabelProps;
  }>;
  content: Array<
    C60NestedComponentC66 | C60NestedComponentC76 | C60NestedComponentC24 | C60NestedComponentC56
  >;
};

type C60NestedComponentC56 = {
  componentId: 'c56';
  data: C56FullWidthMediaProps;
};

type C60NestedComponentC24 = {
  componentId: 'c24';
  data: C24ContentProps;
};

type C60NestedComponentC66 = {
  componentId: 'c66';
  data: C66ColorSwatchesProps;
};

type C60NestedComponentC76 = {
  componentId: 'c76';
  data: C76ButtonReferenceProps;
};
