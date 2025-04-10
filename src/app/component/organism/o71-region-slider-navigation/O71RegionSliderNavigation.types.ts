import A01ImageProps from '../../atom/a01-image/A01Image.types';

export type O71RegionSliderNavigationProps = {
  variant?: string;
  items: ReadonlyArray<[O71RegionItem, O71RegionItem, O71RegionItem, O71RegionItem]>;
  resetOnLeave?: boolean;
};

export type O71RegionItem = {
  images: {
    background: A01ImageProps;
    region: A01ImageProps;
  };
  label: string;
};
