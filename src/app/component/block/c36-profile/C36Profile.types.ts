import A01ImageProps from '../../atom/a01-image/A01Image.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import M22PersonCardProps from '../../molecule/m22-person-card/M22PersonCard.types';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C36ProfileProps = {
  scrollComponent?: boolean;
  fullMinHeight?: boolean;
  id?: string;
  sectorImage?: A01ImageProps;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  header: M04ComponentHeaderProps;
  people: Array<M22PersonCardProps>;
};
