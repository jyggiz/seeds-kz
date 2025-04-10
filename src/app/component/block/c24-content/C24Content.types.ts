import O30ContentGridProps from '../../organism/o30-content-grid/O30ContentGrid.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';

export type C24ContentProps = O30ContentGridProps & {
  id?: string;
  fullMinHeight?: boolean;
  theme?: NeomComponentThemes;
};
