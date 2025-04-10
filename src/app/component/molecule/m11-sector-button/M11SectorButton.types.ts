import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { A01ImageProps } from '../../atom/a01-image/A01Image.types';
import { SectorClickTrackingEvent } from '../../../util/TrackingEvent';

export type M11SectorIcons =
  | 'energy'
  | 'water'
  | 'mobility'
  | 'entertainment-culture'
  | 'food'
  | 'manufacturing'
  | 'media'
  | 'tourism'
  | 'sport'
  | 'design-construction'
  | 'services'
  | 'health-wellbeing-biotech'
  | 'education'
  | 'technology-digital';

export type M11SectorButtonProps = {
  heading: M04ComponentHeaderProps;
  icon: M11SectorIcons;
  copy: string;
  current?: boolean;
  href?: string;
  image?: A01ImageProps;
  eventTracking?: SectorClickTrackingEvent;
};

export default M11SectorButtonProps;
