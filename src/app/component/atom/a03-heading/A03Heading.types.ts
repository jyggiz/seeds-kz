import { TextTransform } from 'app/data/type/TextTransformations';

export type A03HeadingSizes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7';

export type A03HeadingElements =
  | 'h1'
  | 'h2' // default when undefined;
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

type A03HeadingProps = {
  element: A03HeadingElements;
  size?: A03HeadingSizes;
  text: string;
  alignment?: 'start' | 'center' | 'end'; // default is 'start'
  transform?: TextTransform;
};

export default A03HeadingProps;
