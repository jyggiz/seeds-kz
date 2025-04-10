import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import A03Heading from 'app/component/atom/a03-heading/A03Heading';
import M06LinkProps from 'app/component/molecule/m06-link/M06Link.types';

type Link = Omit<M06LinkProps, 'icon' | 'variant'> & {
  variant?: 'heading' | 'regular';
};

type ListItem = Link & {
  subitems?: ReadonlyArray<Link>;
};

type Column = {
  items: ReadonlyArray<ListItem>;
};

type Section = Link & {
  columns: ReadonlyArray<Column>;
};

export type C106SiteIndexProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  id?: string;
  scrollComponent?: boolean;
  heading: A03Heading;
  sections: ReadonlyArray<Section>;
};
