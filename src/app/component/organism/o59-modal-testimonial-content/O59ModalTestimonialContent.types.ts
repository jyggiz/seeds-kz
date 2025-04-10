import { M01BlockquoteProps } from './../../molecule/m01-blockquote/M01Blockquote.types';
import { A01ImageProps } from './../../atom/a01-image/A01Image.types';

export type O59ModalTestimonialContentProps = {
  data: {
    images: { default: A01ImageProps; active: A01ImageProps };
    testimonial: M01BlockquoteProps;
    backButtonLabel?: string;
  };
};
