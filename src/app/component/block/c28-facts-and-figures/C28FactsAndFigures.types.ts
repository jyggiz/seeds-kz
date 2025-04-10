import { M03StickyMediaProps } from '../../molecule/m03-sticky-media/M03StickyMedia.types';
import figureProps from './figure/figure.types';

export type C28FactsAndFigures = {
  scrollComponent: boolean;
  id?: string;
  backgroundImage?: M03StickyMediaProps;
  figures: Array<figureProps>;
};
