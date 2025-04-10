import A01ImageProps from '../../atom/a01-image/A01Image.types';
import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { LinkProps } from '../../../data/interface/LinkProps';
import { ShareProps } from '../c44-article-content/C44ArticleContent.types';
import { TableOfContentsProps } from './component/organism/table-of-contents/TableOfContents.types';
import { AuthorInfoProps } from './component/molecule/author-info/AuthorInfo.types';

export type ParagraphItemProps = {
  id?: string;
  type: 'paragraph' | 'cta';
  highlighted?: boolean;
};

export type C101NewArticleProps = {
  image?: A01ImageProps;
  publicationDate: string;
  heading: A03HeadingProps;
  author?: AuthorInfoProps;
  items: Array<ParagraphItemProps>;
  overviewLink: LinkProps;
  share: ShareProps;
  tableOfContents?: TableOfContentsProps;
};
