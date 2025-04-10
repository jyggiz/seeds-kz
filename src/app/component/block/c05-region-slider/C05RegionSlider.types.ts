import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { O72RegionSliderContentProps } from '../../organism/o72-region-slider-content/O72RegionSliderContent.types';
import m18ParagraphTypes from '../../molecule/m18-paragraph/M18Paragraph.types';
import a01ImageTypes from '../../atom/a01-image/A01Image.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';

export type C05RegionSliderProps = {
  theme?: NeomComponentThemes;
  id?: string;
  scrollComponent?: boolean;
  activeItem?: number;
  variant?: string;
  intro?: Array<intro>;
  resetOnLeave?: boolean;
  images: {
    region: A01ImageProps;
  };
} & O72RegionSliderContentProps;

interface intro {
  content: m18ParagraphTypes;
  image: a01ImageTypes;
}
