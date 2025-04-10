import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';

export type M48SliderPaginationProps = {
  id?: string;
  autoplay?: boolean;
  items: ReadonlyArray<Partial<A04EyebrowProps> & unknown>;
  eyebrow?: A04EyebrowProps;
  isSlider?: boolean;
  variant?: 'contentWidth' | 'fullWidth'; // fitContent is default
};
