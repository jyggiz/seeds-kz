import { BlockPaddingProps } from '../../../data/type/BlockPaddings';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { O53TextAssetProps } from '../../organism/o53-text-asset/O53TextAsset.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C09ContentGroupProps = {
  id?: string;
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  theme?: NeomComponentThemes;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  background?: M34ComponentBackgroundProps;
  header?: M04ComponentHeaderProps;
  items: Array<C09ContentGroupItem>;
  buttons?: Array<M02ButtonProps>;
};

interface C09ContentGroupItem {
  id: 'o53';
  data: O53TextAssetProps;
}
