import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { O35ArticleCardProps } from '../../organism/o35-article-card/O35ArticleCard.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';

export type C97SearchResultsProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;

  header: A03HeadingProps;
  results: ReadonlyArray<C97Result>;
  showButtonCopy: string;
  hideButtonCopy: string;

  emptyContent?: M04ComponentHeaderProps;
};

type C97Result = {
  header: string;
  items: ReadonlyArray<O35ArticleCardProps>;
};
