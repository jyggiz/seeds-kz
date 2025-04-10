import { O39LightboxContentProps } from '../o39-lightbox-content/O39LightboxContent.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import { O01VideoProps } from '../../organism/o01-video/O01Video.types';

export type O41MediaCardProps = {
  heading: A04EyebrowProps;
  datePublished: string;
  image?: A01ImageProps;
  video?: O01VideoProps;
  link: {
    label: string;
    href: string;
  };
  lightbox?: Array<O39LightboxContentProps>;
};
