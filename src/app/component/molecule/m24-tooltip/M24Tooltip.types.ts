import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';

export type M24TooltipProps = {
  id?: string;
  eyebrow?: A04EyebrowProps;
  isStatic?: boolean;
  aria?: Record<string, string>;
};
