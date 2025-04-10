import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type O101VideoContentProps = {
  id?: string;
  scrollComponent?: boolean;
  video: A19VideoProps;
  header?: A03HeadingProps;
  playButton?: M02ButtonProps;
};
