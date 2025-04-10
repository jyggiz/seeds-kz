import { O60HeroContentProps } from '../../organism/o60-hero-content/O60HeroContent.types';

export type C26HeroBannerProps = O60HeroContentProps & {
  scrollComponent?: boolean;
  earlyDisplay?: boolean;
  fullHeight?: boolean; //defaults to true
  optimizeForLCP?: boolean;
};
