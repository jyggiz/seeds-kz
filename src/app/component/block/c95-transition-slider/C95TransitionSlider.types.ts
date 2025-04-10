import { O88TransitionSlideProps } from '../../organism/o88-transition-slide/O88TransitionSlide.types';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { NeomThemeBackgroundColors } from 'app/data/type/ComponentThemes';
import { A19VideoProps } from 'app/component/atom/a19-video/A19Video.types';

export type C95TransitionSliderProps = {
  id?: string;
  scrollComponent?: boolean;
  padding?: BlockComponentPadding;
  heading: A03HeadingProps;
  slides: ReadonlyArray<O88TransitionSlideProps> & {
    label: string;
  };
  backgroundColor?: NeomThemeBackgroundColors;
  intro: A19VideoProps;
  cloudsOverlay: Array<{ src: string }>;
};
