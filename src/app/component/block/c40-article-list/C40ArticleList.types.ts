import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';
import { O35ArticleCardProps } from '../../organism/o35-article-card/O35ArticleCard.types';

export type C40ArticleListProps = {
  columnCount?: number;
  firstBlock?: boolean;
  scrollComponent?: boolean;
  header?: M18ParagraphProps;
  items: Array<O35ArticleCardProps>;
};
