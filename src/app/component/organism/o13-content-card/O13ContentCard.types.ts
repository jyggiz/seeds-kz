import A01ImageProps from '../../atom/a01-image/A01Image.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import { ContentScopeProps } from '../../../data/type/Scopes';
import { ImageRatios } from '../../../data/type/ImageRatios';
import { LinkProps } from '../../../data/interface/LinkProps';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';
import { O01VideoProps } from '../o01-video/O01Video.types';

export type O13ContentCardVariants = 'social';

export type O13ContentCardProps = {
  id?: string;
  scrollComponent?: boolean;
  variant?: O13ContentCardVariants;
  theme?: NeomComponentThemes;
  thumbnail?: {
    aspectRatio: ImageRatios;
    image: A01ImageProps;
    video?: A19VideoProps;
  };
  meta?: {
    author?: string;
    date?: string;
    section?: string;
    month: string;
    year: string;
  };
  content: {
    heading: A03HeadingProps;
    description: ContentScopeProps;
  };
  button?: M02ButtonProps;
  video?: O01VideoProps;
  link?: LinkProps;
};
