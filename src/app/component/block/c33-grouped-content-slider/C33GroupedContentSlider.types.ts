import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { O78TimelineCardProps } from '../../organism/o78-timeline-card/O78TimelineCard.types';

export type C33GroupedContentSliderProps = {
  id?: string;
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  timeline?: boolean;
  background: M34ComponentBackgroundProps;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  eyebrow: A04EyebrowProps;
  groups: Array<C33GroupedContentSliderGroupProps>;
};

type C33GroupedContentSliderGroupProps = {
  label: string;
  items: Array<O78TimelineCardProps>;
};
