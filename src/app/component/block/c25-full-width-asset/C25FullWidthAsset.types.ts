import { BlockPaddingProps } from '../../../data/type/BlockPaddings';
import A04EyebrowTypes from '../../atom/a04-eyebrow/A04Eyebrow.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A05MoustacheProps from '../../atom/a05-moustache/A05Moustache.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';

export type C25FullWidthAssetProps = {
  scrollComponent?: boolean;
  padding?: BlockPaddingProps;
  eyebrow?: A04EyebrowTypes;
  heading: A03HeadingProps;
  moustache?: A05MoustacheProps;
  buttons?: Array<M02ButtonProps>;
  shareButton?: M02ButtonProps;
  image?: A01ImageProps;
  backgroundVideo?: A19VideoProps;
  theme?: NeomComponentThemes;
  cropped?: boolean; //defaults to false
};
