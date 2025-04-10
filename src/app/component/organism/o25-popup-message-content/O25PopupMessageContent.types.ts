import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { ContentItemProps } from '../../../data/interface/ContentItemProps';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';

export type O25PopupMessageContentProps = {
  heading: A03HeadingProps;
  items: Array<ContentItemProps>;
  buttons: Array<M02ButtonProps>;
};
