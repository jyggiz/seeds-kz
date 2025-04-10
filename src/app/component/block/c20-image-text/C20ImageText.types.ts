import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import M16FigureProps from '../../molecule/m16-figure/M16Figure.types';
import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';
import O30ContentGridDisabledPadding from '../../organism/o30-content-grid/O30ContentGrid.types';
import O30ContentGridItemAlignment from '../../organism/o30-content-grid/O30ContentGrid.types';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

type C20ImageTextTypes = 'asset' | 'paragraph';

export type C20ImageTextItem = {
  align: O30ContentGridItemAlignment;
  buttons: Array<M02ButtonProps>;
  content: M16FigureProps | M18ParagraphProps | A19VideoProps;
  type: C20ImageTextTypes;
};

export type C20ImageTextProps = {
  theme?: NeomComponentThemes;
  fullMinHeight?: boolean;
  id?: string;
  assetPull?: boolean;
  items: Array<C20ImageTextItem>;
  paddingDisabled?: O30ContentGridDisabledPadding;
  scrollComponent: boolean;
  variant?: string;
};
