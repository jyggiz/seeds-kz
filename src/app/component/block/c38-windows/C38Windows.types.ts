import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import O33WindowProps from '../../organism/o33-window/O33Window.types';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';

type C38SectorThemes =
  | 'color-dark-cerulean'
  | 'color-olive-drab'
  | 'color-rouge'
  | 'color-atoll'
  | 'color-shuttle-grey'
  | 'color-night-shadz'
  | 'color-sun-orange'
  | 'color-observatory'
  | 'color-zorba'
  | 'color-cannon-pink'
  | 'color-cello'
  | 'color-pine-cone'
  | 'color-blue-diamond';

type C38WindowsProps = {
  scrollComponent?: boolean;
  id?: string;
  eyebrow: A04EyebrowProps;
  items: Array<O33WindowProps>;
  background?: M34ComponentBackgroundProps;
  sectorTheme?: C38SectorThemes;
};

export default C38WindowsProps;
