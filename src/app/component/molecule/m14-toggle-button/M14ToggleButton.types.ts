import A07LabelProps from '../../atom/a07-label/A07Label.types';

export type M14ToggleButtonVariants = 'accordion';

export type M14ToggleButtonProps = {
  variant?: M14ToggleButtonVariants;
  label: A07LabelProps;
  aria?: Record<string, string>;
};

export default M14ToggleButtonProps;
