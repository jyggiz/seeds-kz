import { M03StickyMediaProps } from '../../molecule/m03-sticky-media/M03StickyMedia.types';
import O06CollapsibleItemProps from '../../organism/o06-collapsible-item/O06CollapsibleItem.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import M18ParagraphProps from 'app/component/molecule/m18-paragraph/M18Paragraph.types';

export type C07AccordionProps = {
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  id?: string;
  theme: NeomComponentThemes;
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockPaddingProps;
  background?: {
    image: M03StickyMediaProps;
  };
  title?: M18ParagraphProps;
  items: Array<O06CollapsibleItemProps>;
  linkWithArrows?: boolean;
};

export default C07AccordionProps;
