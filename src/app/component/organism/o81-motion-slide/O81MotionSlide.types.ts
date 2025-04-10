import A01ImageProps from '../../atom/a01-image/A01Image.types';
import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { VerticalAlignmentTypes } from '../../../data/interface/Alignment';

export type O81MotionSlideProps = {
  id?: string;
  scrollComponent?: boolean;
  variant?: 'inverse';
  image: A01ImageProps;
  content: M18ParagraphProps & {
    align?: VerticalAlignmentTypes; // middle is default
  };
  buttons: ReadonlyArray<M02ButtonProps>;
  equalContentWidth?: boolean;
};
