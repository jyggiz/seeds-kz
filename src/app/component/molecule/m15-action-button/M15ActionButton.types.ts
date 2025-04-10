import { M02ButtonTarget } from '../m02-button/M02Button.types';

export type M15ActionButtonProps = {
  label: Array<{
    top: string;
    bottom: string;
  }>;
  variant?: string;
  target?: M02ButtonTarget;
};

export default M15ActionButtonProps;
