import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { LinkProps } from '../../../data/interface/LinkProps';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type O14PopoutCardProps = {
  image: A01ImageProps;
  heading: {
    text: string;
  };
  button?: M02ButtonProps;
  link?: LinkProps;
};
