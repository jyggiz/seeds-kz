import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { LinkProps } from '../../../data/interface/LinkProps';

export type O35ArticleCardProps = {
  datePublished?: string;
  highlighted?: boolean;
  image?: A01ImageProps;
  heading: {
    text: string;
  };
  copy: string;
  link: LinkProps;
};
