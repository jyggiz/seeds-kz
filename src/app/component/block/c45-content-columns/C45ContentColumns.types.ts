import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';
import { Alignment } from '../../../data/interface/Alignment';
import { BlockPaddingProps } from '../../../data/type/BlockPaddings';
import { C30DownloadsProps } from '../c30-downloads/C30Downloads.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { O45FormProps } from '../../organism/o45-form/O45Form.types';
import { ShareProps } from '../../../data/type/Share';

interface C45ColumnItem {
  align: Alignment;
  variant?: 'wide';
}

interface C45ColumnItemM04 extends C45ColumnItem {
  componentId: 'm04';
  data: M04ComponentHeaderProps;
}

interface C45ColumnItemM18 extends C45ColumnItem {
  componentId: 'm18';
  data: M18ParagraphProps;
}

interface C45ColumnItemC30 extends C45ColumnItem {
  componentId: 'c30';
  data: C30DownloadsProps;
}

interface C45ColumnItemO45 extends C45ColumnItem {
  componentId: 'o45';
  data: O45FormProps;
}

export type C45ContentColumns = {
  scrollComponent?: boolean;
  shareButton?: ShareProps;
  theme?: NeomComponentThemes;
  variant?: string;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  buttons?: ReadonlyArray<M02ButtonProps>;
  columns: Array<C45ColumnItemM04 | C45ColumnItemM18 | C45ColumnItemC30 | C45ColumnItemO45>;
};
