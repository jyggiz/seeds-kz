export type O36SecondaryNavigationProps = {
  parent: {
    label: string;
  };
  items: Array<{
    active?: boolean;
    externalLink?: boolean;
    href: string;
    label: string;
  }>;
};
