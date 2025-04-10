import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import M04ComponentHeaderProps from 'app/component/molecule/m04-component-header/M04ComponentHeader.types';
import { Alignment } from 'app/data/interface/Alignment';
import { SliderImpressionTrackingEvent } from '../../../util/TrackingEvent';

type C58Item = {
  image: A01ImageProps;
  header: M04ComponentHeaderProps;
  description?: string;
  active: boolean;
  alignment: Alignment;
  trackingEvent?: SliderImpressionTrackingEvent;
};

export type C58HighlightSlideshowProps = {
  id?: string;
  items: ReadonlyArray<C58Item>;
  hasControls: boolean;
  hasPagination: boolean;
  hasGradient: boolean;
  roundedPagination?: boolean;
  disableScaleAnimation?: boolean;
};

export type SlideTransitionOptions = {
  autoAlphaDuration: number;
  scaleDuration: number;
  slide: HTMLElement;
  image: HTMLElement;
  isShown: boolean;
  disabledScaleAnimation: boolean;
};
