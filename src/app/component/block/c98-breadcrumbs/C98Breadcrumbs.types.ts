import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { M57BreadcrumbsProps } from '../../molecule/m57-breadcrumbs/M57Breadcrumbs.types';

export type C98BreadcrumbsProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  items: M57BreadcrumbsProps;
  theme?: 'light' | 'dark';
  divider?: 'fullWidth' | 'withPadding';
  nonClickable?: boolean;
};
