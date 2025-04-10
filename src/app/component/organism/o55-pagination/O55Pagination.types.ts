import { O57PaginationItemProps } from './../o57-pagination-item/O57PaginationItem.types';

export type O55PaginationProps = {
  limit: number;
  pages: Array<O57PaginationItemProps>;
  offset: number;
  total: number;
};
