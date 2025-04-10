import O60HeroContent from '../../organism/o60-hero-content/O60HeroContent';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';

type C12HeroSliderItemProps = O60HeroContent & {
  topic?: string;
};

export type C12HeroSliderProps = {
  scrollComponent?: boolean;
  optimizeForLCP?: boolean;
  earlyDisplay?: boolean;
  clip?: boolean;
  sliderAriaLabel?: string;
  items: Array<C12HeroSliderItemProps>;
  theme?: NeomComponentThemes;
};
