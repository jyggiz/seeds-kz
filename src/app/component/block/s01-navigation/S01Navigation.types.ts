import A01ImageProps from '../../atom/a01-image/A01Image.types';
import M19LogoProps from '../../molecule/m19-logo/M19Logo.types';
import { LinkProps } from '../../../data/interface/LinkProps';
import { O04LanguageSelectorProps } from '../../organism/o04-language-selector/O04LanguageSelector.types';
import { O88SearchBarProps } from '../../organism/o88-search-bar/O88SearchBar.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';

enum MenuNames {
  MENU = 'menu',
  SECTOR_MENU = 'sectorMenu',
  REGION_MENU = 'regionMenu',
}

interface Link extends LinkProps {
  active?: boolean;
  highlighted?: boolean;
}

interface SectorLink extends Link {
  icon: string;
  image: A01ImageProps;
}

interface RegionLink extends Link {
  image: A01ImageProps;
}

interface Menu {
  active?: boolean;
  items: Array<Link | SectorMenu>;
  label: string;
  type: MenuNames.MENU;
}

interface SectorMenu extends Omit<Menu, 'items' | 'type'> {
  items: Array<SectorLink>;
  type: MenuNames.SECTOR_MENU;
  viewAllButton?: M02ButtonProps;
}

interface RegionMenu extends Omit<Menu, 'items' | 'type'> {
  items: Array<RegionLink>;
  type: MenuNames.REGION_MENU;
}

interface CTA {
  type: 'CTA';
  button: M02ButtonProps;
}

export type S01NavigationProps = {
  navigationContent: {
    scrollComponent: boolean;
    logo: M19LogoProps;
    navigation: {
      mainAriaLabel?: string;
      main: Array<Link | Menu | RegionMenu | SectorMenu>;
      aside: Array<Link | Menu | CTA>;
      isSearchHidden?: boolean;
    };
    secondaryNavigation?: {
      parent: Link;
      items: Array<Link>;
    } & O04LanguageSelectorProps;
    isStickySearch?: boolean;
    search: O88SearchBarProps & {
      mainButtonAria?: {
        label: string;
        controls?: string;
      };
    };
  };
};
