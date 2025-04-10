import { A02IconProps } from '../../atom/a02-icon/A02Icon.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import M06LinkProps from '../../molecule/m06-link/M06Link.types';
import { HorizontalAlignmentTypes } from '../../../data/interface/Alignment';
import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import { M34ComponentBackgroundProps } from 'app/component/molecule/m34-component-background/M34ComponentBackground.types';

export type O34BoxedCardVariants = 'indexed' | 'singleRow';

export type O34BoxedCardProps = {
  align: Omit<HorizontalAlignmentTypes, HorizontalAlignmentTypes.END>;
  icon?: A02IconProps;
  image?: A01ImageProps;
  heading: A03HeadingProps & Pick<M06LinkProps, 'href' | 'target'>;
  copy: string;
  link?: M06LinkProps;
  variant?: O34BoxedCardVariants;
  background?: M34ComponentBackgroundProps;
  modal?: boolean;
};
