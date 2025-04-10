import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';

type C69Item = {
  size: string;
  heading: A03HeadingProps;
  image: {
    src: string;
    alt: string;
  };
  description: string;
  table: {
    familyName: string;
    items: Array<{
      fontWeight: string;
      fontExample: string;
    }>;
  };
};

export type C69TypeFaceProps = {
  id?: string;
  scrollComponent?: boolean;
  heading: A03HeadingProps;
  description: string;
  items: ReadonlyArray<C69Item>;
  scale: {
    subtitle: string;
    copy: string;
  };
};
