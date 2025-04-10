import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';
import A03HeadingProps from 'app/component/atom/a03-heading/A03Heading.types';
import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';

export type C71FactsListProps = {
  theme?: NeomComponentThemes;
  id?: string;
  scrollComponent?: boolean;
  variant?: 'large' | 'medium' | 'small'; // medium is default
  heading: string;
  eyebrow: A04EyebrowProps;
  items: Array<{
    title: string;
    image: A01ImageProps;
    modal?: C71ModalContent;
  }>;
};

export type C71ModalContent = {
  heading: A03HeadingProps;
  copy: string;
};
