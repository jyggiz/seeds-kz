import { O55PaginationProps } from 'app/component/organism/o55-pagination/O55Pagination.types';
import { O70ModalBioContentProps } from 'app/component/organism/o70-modal-bio-content/O70ModalBioContent.types';
import { O43FilterProps } from 'app/component/organism/o43-filter/O43Filter.types';

type Item = Omit<O70ModalBioContentProps, 'id' | 'scrollComponent'> & {
  hasArrow?: boolean;
};

export type C70CardGridProps = {
  id?: string;
  scrollComponent?: boolean;
  filter: O43FilterProps;
  pagination: O55PaginationProps;
  items: Array<Item>;
};

export type C70CardGridFilteredData = {
  data: Pick<C70CardGridProps, 'items' | 'pagination'>;
  status: 'success' | 'failure';
};
