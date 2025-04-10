import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';
import O11ModalContentProps from '../../organism/o11-modal-content/O11Modal.types';
import { BlockPaddingProps } from '../../../data/type/BlockPaddings';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C17SectorProps = {
  scrollComponent?: boolean;
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockPaddingProps;
  heading: M04ComponentHeaderProps;
  description: M18ParagraphProps;
  items: Array<O11ModalContentProps>;
  id?: string;
  theme?: NeomComponentThemes;
};
