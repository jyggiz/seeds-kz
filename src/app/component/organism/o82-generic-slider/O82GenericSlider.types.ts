import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import A05MoustacheProps from '../../atom/a05-moustache/A05Moustache.types';
import O42SliderControlsProps from '../o42-slider-controls/O42SliderControls.types';
import { O13ContentCardProps } from '../o13-content-card/O13ContentCard.types';
import { O14PopoutCardProps } from '../o14-popout-card/O14PopoutCard.types';

export type O82GenericSliderProps = {
  id?: string;
  scrollComponent?: boolean;
  eyebrow?: A04EyebrowProps;
  theme?: 'dark' | 'darkMono';
  header?: A03HeadingProps;
  controls: O42SliderControlsProps;
  moustache?: A05MoustacheProps;
  items: Array<O82SlideItemO14 | O82SlideItemO13>;
  listSorter?: O82SorterItems;
};

interface O82SorterItems {
  items: Array<{
    active?: boolean;
    label: string;
    value: string;
  }>;
}

interface O82SlideItemO13 {
  variant: string;
  componentId: 'o13';
  data: O13ContentCardProps;
}

interface O82SlideItemO14 {
  variant: string;
  componentId: 'o14';
  data: O14PopoutCardProps;
}
