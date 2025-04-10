import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import { A02IconProps } from 'app/component/atom/a02-icon/A02Icon.types';
import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';

export enum ModalListVariant {
  Itineraries = 'itineraries',
  GroupedHotspots = 'groupedHotspots',
}

export type O67ModalListViewerProps = {
  id?: string;
  scrollComponent?: boolean;
  button: M02ButtonProps;
  heading: A03HeadingProps;
  type?: ModalListVariant.Itineraries | ModalListVariant.GroupedHotspots;
  items: Array<ItineraryItem & GroupedHotspotsItem>;
};

export type ItineraryItem = {
  image: A01ImageProps;
  heading: {
    button?: M02ButtonProps;
  };
  description: string;
  path: Array<number>; // index of hotspot(s) for retrieving the offset for each point in a path
  items: Array<ItineraryStep & GroupedHotspotsSubItem>;
};

export type GroupedHotspotsSubItem = {
  heading: {
    button?: M02ButtonProps;
  };
  description: string;
};

export type GroupedHotspotsItem = {
  heading: A04EyebrowProps;
  icon?: A02IconProps;
  items: Array<GroupedHotspotsSubItem & ItineraryStep>;
};
export interface ItineraryStep {
  heading: {
    eyebrow?: A04EyebrowProps;
  };
  description: string;
}
