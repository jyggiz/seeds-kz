import { O44FilterOptionListProps } from './../o44-filter-option-list/O44FilterOptionList.types';
import A07LabelProps from 'app/component/atom/a07-label/A07Label.types';
import { C46MediaListFilteredData } from 'app/component/block/c46-media-list/C46MediaList.types';
import { C70CardGridFilteredData } from 'app/component/block/c70-card-grid/C70CardGrid.types';

export type O43FilterProps = {
  filterApiUrl: string;
  devEnvironmentUrl?: string;
  searchField: boolean;
  primary: {
    items: Array<O43FilterPrimaryItemProps>;
  };
  secondary: {
    items: Array<O43FilterSecondaryItemProps>;
  };
};

type O43FilterPrimaryItemProps = {
  label: string;
  value: string;
  active?: boolean;
};

type O43FilterSecondaryItemProps = {
  label: A07LabelProps;
  value: string;
  items: Array<O44FilterOptionListProps>;
};

export type FilteredData = {
  response: C46MediaListFilteredData | C70CardGridFilteredData;
  devUrl?: string;
  paginationData?: {
    limit: string;
    offset: string;
  };
};
