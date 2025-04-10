import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { A02IconProps } from '../../atom/a02-icon/A02Icon.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';

export enum M01BlockquoteVariants {
  ROYAL_ANNOUNCEMENT = 'royalAnnouncement',
  TESTIMONIAL = 'testimonial',
}

export enum M01BlockquoteImageTypes {
  PHOTO = 'photo',
}

export type M01BlockquoteProps =
  | M01BlockquoteRoyalAnnouncement
  | M01BlockquoteTestimonial
  | M01BlockquoteGeneric
  | M01BlockquoteImage
  | M01BlockquoteIcon;

interface M01BlockquoteGeneric {
  size?: 'large' | 'medium' | 'small';
  eyebrow?: A04EyebrowProps;
  quote: string;
  author?: {
    prefix?: string;
    name?: string;
    role?: string;
  };
}

interface M01BlockquoteIcon extends M01BlockquoteGeneric {
  icon: A02IconProps;
}

interface M01BlockquoteImage extends M01BlockquoteGeneric {
  image: A01ImageProps & { type?: M01BlockquoteImageTypes };
}

interface M01BlockquoteRoyalAnnouncement extends M01BlockquoteGeneric {
  variant: M01BlockquoteVariants.ROYAL_ANNOUNCEMENT;
}

export interface M01BlockquoteTestimonial extends M01BlockquoteGeneric {
  variant: M01BlockquoteVariants.TESTIMONIAL;
}
