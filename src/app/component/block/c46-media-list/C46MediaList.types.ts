import { O55PaginationProps } from './../../organism/o55-pagination/O55Pagination.types';
import { O43FilterProps } from './../../organism/o43-filter/O43Filter.types';
import O39LightboxContentProps from 'app/component/organism/o39-lightbox-content/O39LightboxContent.types';
import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C46MediaListProps = {
  scrollComponent?: boolean;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  content: O39LightboxContentProps['content'];
  filter: O43FilterProps;
  pagination: O55PaginationProps;
  checkboxLabels: {
    select: string;
    selected: string;
  };
  apiUrl: string;
};

export type C46MediaListFilteredData = {
  data: {
    scrollComponent?: boolean;
    content: Omit<O39LightboxContentProps['content'], 'termsOfUse'>;
  };
  pagination: O55PaginationProps;
  status: 'success' | 'failure';
};
