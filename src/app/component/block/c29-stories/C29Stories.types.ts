import { O17StoriesProps } from '../../organism/o17-stories/O17Stories.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockPaddingProps } from '../../../data/type/BlockPaddings';

export type C29StoriesProps = O17StoriesProps & {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockPaddingProps;
  scrollComponent?: boolean;
  themes?: NeomComponentThemes;
  overlapTopComponent?: boolean;
};
