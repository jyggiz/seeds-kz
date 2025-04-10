import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { O81MotionSlideProps } from '../../organism/o81-motion-slide/O81MotionSlide.types';

export type C57MotionSliderProps = {
  id?: string;
  scrollComponent?: boolean;
  theme?: NeomComponentThemes;
  padding?: BlockComponentPadding;
  backgroundColor?: NeomThemeBackgroundColors;
  heading: A03HeadingProps;
  items: ReadonlyArray<{
    item: O81MotionSlideProps;
  }>;
};
