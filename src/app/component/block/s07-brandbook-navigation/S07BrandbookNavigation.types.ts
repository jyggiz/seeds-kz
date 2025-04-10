import M19LogoProps from '../../molecule/m19-logo/M19Logo.types';

export type S07BrandbookNavigationProps = {
  logo: M19LogoProps;
  navigation: Array<S07BrandbookNavigationLink | S07BrandbookNavigationMenu>;
};

interface S07BrandbookNavigationMenu {
  active?: boolean;
  type: 'menu';
  label: string;
  items: Array<S07BrandbookNavigationLink>;
}

interface S07BrandbookNavigationLink {
  active?: boolean;
  href: string;
  label: string;
  target?: '_blank' | '_self';
}
