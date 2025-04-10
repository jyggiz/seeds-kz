import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import { O95Item } from 'app/component/organism/o95-dynamic-carousel/O95DynamicCarousel.types';
import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';
import A05MoustacheProps from 'app/component/atom/a05-moustache/A05Moustache.types';
import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';

export type C104JourneyProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  theme: NeomComponentThemes;
  scrollComponent?: boolean;
  heading: A03HeadingProps;
  initialSlideIndex: string;
  timelinePoints: Array<{
    id: string;
    description: string;
  }>;
  items: Array<Item>;
};

interface Item extends Omit<O95Item, 'data'> {
  data: {
    timelinePointId: string;
    eyebrow?: A04EyebrowProps;
    moustache?: A05MoustacheProps;
    image: A01ImageProps;
  };
}
