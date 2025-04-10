import { LinkProps } from 'app/data/interface/LinkProps';
import { TextTransform } from 'app/data/type/TextTransformations';

export type M57BreadcrumbsProps = {
  items: Array<Omit<LinkProps, 'target'>> & {
    nonClickable: boolean;
    transform?: TextTransform;
  };
};
