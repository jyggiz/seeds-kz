import { M56StatisticCardProps } from '../../molecule/m56-statistic-card/M56StatisticCard.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { ContentItemProps } from 'app/data/interface/ContentItemProps';
import { O71RegionItem } from '../o71-region-slider-navigation/O71RegionSliderNavigation.types';
import { A19VideoProps } from 'app/component/atom/a19-video/A19Video.types';
import { LinkProps } from 'app/data/interface/LinkProps';

type Background = O71RegionItem & {
  video?: A19VideoProps;
  link?: LinkProps;
};

export type O88TransitionSlideProps = {
  id?: string;
  scrollComponent?: boolean;
  eyebrow?: A04EyebrowProps;
  copy: ContentItemProps;
  buttons: ReadonlyArray<M02ButtonProps>;
  statistic: M56StatisticCardProps;
  mapType?: 'default' | 'regions' | 'features' | 'places';
  backgrounds: ReadonlyArray<Background>;
  initialImage: {
    region: A01ImageProps;
  };
};
