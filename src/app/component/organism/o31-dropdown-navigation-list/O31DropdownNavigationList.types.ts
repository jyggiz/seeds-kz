import A01ImageProps from '../../atom/a01-image/A01Image.types';
import { A02IconProps } from '../../atom/a02-icon/A02Icon.types';

type O31DropdownNavigationListMenuTypes = 'menu' | 'projectMenu' | 'sectorMenu';

interface O31DropdownNavigationListItem {
  active?: boolean;
  href: string;
  label: string;
}

interface O31DropdownNavigationListMenuItem extends O31DropdownNavigationListItem {
  target?: '_self' | '_blank';
}

interface O31DropdownNavigationListProjectItem extends O31DropdownNavigationListItem {
  image: A01ImageProps;
}

interface O31DropdownNavigationListSectorItem extends O31DropdownNavigationListItem {
  icon: A02IconProps;
  image: A01ImageProps;
}

export type O31DropdownNavigationListProps = {
  type: O31DropdownNavigationListMenuTypes;
  items: Array<
    | O31DropdownNavigationListProjectItem
    | O31DropdownNavigationListSectorItem
    | O31DropdownNavigationListMenuItem
  >;
};
