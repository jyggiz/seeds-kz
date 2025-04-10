import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';

interface C56FullWidthMediaBase {
  disableTransition?: boolean;
  id?: string;
  heading?: A03HeadingProps;
  theme?: NeomComponentThemes;
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
}

interface C56FullWidthMediaImage extends C56FullWidthMediaBase {
  image: A01ImageProps;
}

interface C56FullWidthMediaVideo extends C56FullWidthMediaBase {
  image: A19VideoProps;
}

export type C56FullWidthMediaProps = C56FullWidthMediaImage | C56FullWidthMediaVideo;
