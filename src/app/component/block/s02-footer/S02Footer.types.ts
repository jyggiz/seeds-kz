import A03Heading from '../../atom/a03-heading/A03Heading';
import M12SocialProps from '../../molecule/m12-social/M12Social.types';
import { LinkProps } from '../../../data/interface/LinkProps';

interface FooterLinkList {
  scrollComponent?: boolean;
  heading: Omit<A03Heading, 'element' | 'size'>; // just the text string is configurable, the rest is hardcoded.
  items: Array<LinkProps>;
}

type sitemapItem = ReadonlyArray<{
  label: string;
  items: Array<LinkProps>;
}>;

export type S02FooterProps = {
  sitemap: ReadonlyArray<sitemapItem>; // array length is 4 (limited)
  news: FooterLinkList;
  theme?: 'neom' | 'oxagon';
  social: M12SocialProps & {
    label: string;
  };
  marginalia: Array<LinkProps>;
};
