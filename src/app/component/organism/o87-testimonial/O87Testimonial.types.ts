import { M01BlockquoteTestimonial } from '../../molecule/m01-blockquote/M01Blockquote.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type O87TestimonialProps = {
  buttons?: ReadonlyArray<M02ButtonProps>;
  ariaLive?: string;
} & M01BlockquoteTestimonial;
