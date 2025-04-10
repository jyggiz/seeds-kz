import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { ContentItemProps } from '../../../data/interface/ContentItemProps';
import { LinkProps } from '../../../data/interface/LinkProps';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';

export type C44ArticleContentProps = {
  image: A01ImageProps;
  publicationDate?: string;
  heading?: A03HeadingProps;
  author?: {
    name: string;
  };
  items: Array<ContentItemProps>;
  overviewLink: LinkProps;
  share?: ShareProps;
  bannerInfo?: M04ComponentHeaderProps;
};

export interface ShareProps {
  heading: {
    text: string;
  };
  eventTracking: {
    event: 'Article Share';
    article: {
      author: string;
      publishingDate: string;
      title: string;
      titleInEnglish: string;
    };
  };
  items: ReadonlyArray<{
    href: string;
    icon: string;
    id: string;
    label: string;
  }>;
}
