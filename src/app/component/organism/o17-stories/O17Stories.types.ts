import { NeomComponentThemes } from '../../../data/type/ComponentThemes';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';

export type O17StoriesProps = {
  header: M04ComponentHeaderProps;
  items: ReadonlyArray<O17StoriesProps>;
};
