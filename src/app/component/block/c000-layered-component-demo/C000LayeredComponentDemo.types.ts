import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { O95DynamicCarouselProps } from 'app/component/organism/o95-dynamic-carousel/O95DynamicCarousel.types';
import { M48SliderPaginationProps } from 'app/component/molecule/m48-slider-pagination/M48SliderPagination.types';
import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';

export type C000LayeredComponentDemoProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  slider: O95;
  pagination: M48;
  heading: A03;
};

type O95 = {
  componentName: SliderComponents.O95;
  data: O95DynamicCarouselProps;
};

type M48 = {
  componentName: PaginationComponents.M48;
  data: M48SliderPaginationProps;
};

type A03 = {
  componentName: HeadingComponents.A03;
  data: A03HeadingProps;
};

export enum SliderComponents {
  O95 = 'o95-dynamic-carousel',
}

export enum PaginationComponents {
  M48 = 'm48-slider-pagination',
}

export enum HeadingComponents {
  A03 = 'a03-heading',
}
