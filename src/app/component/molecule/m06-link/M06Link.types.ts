import A07LabelVariants from '../../atom/a07-label/A07Label.types';

export type M06LinkTargets = '_blank' | '_self';

export type M06LinkProps = {
  label: string;
  href?: string;
  target?: M06LinkTargets;
  variant?: A07LabelVariants;
  icon?: string;
};

export default M06LinkProps;
