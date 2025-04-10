import { M25TileButtonProps } from '../../molecule/m25-tile-button/M25TileButton.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from 'app/data/type/BlockComponentPadding';

export type C42NavigationTilesProps = {
  theme?: NeomComponentThemes;
  scrollComponent: boolean;
  items: {
    previous?: M25TileButtonProps;
    next?: M25TileButtonProps;
  };
  padding?: BlockComponentPadding;
};
