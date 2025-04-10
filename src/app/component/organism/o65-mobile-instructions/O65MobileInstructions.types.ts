import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type O65MobileInstructionsProps = {
  id?: string;
  scrollComponent?: boolean;
  heading: A03HeadingProps;
  content: string;
  button: M02ButtonProps;
  notice: string;
};
