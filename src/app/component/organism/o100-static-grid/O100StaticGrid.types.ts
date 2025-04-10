import { C118ContentItemProps } from '../../block/c118-content/component/content-item/C118ContentItem.types';

export type O100StaticGridProps = {
  columnGap?: Gap;
  rowGap?: Gap;
  fullWidth?: boolean;
  items: Array<GridItem>;
};

export type Gap = {
  smallScreen?: string;
  mediumScreen?: string;
  largeScreen?: string;
};

export type GridItem = {
  gridArea: {
    smallScreen?: string;
    mediumScreen?: string;
    largeScreen?: string;
  };
  alignment: {
    vertical: 'start' | 'center' | 'end';
  };
  componentName: GridItemComponents.C118ContentItem;
  data: C118ContentItemProps;
};

export enum GridItemComponents {
  C118ContentItem = 'c118-content-item',
}
