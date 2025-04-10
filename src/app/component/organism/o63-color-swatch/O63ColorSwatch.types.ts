import { M44CopyProgressIndicatorProps } from 'app/component/molecule/m44-copy-progress-indicator/M44CopyProgressIndicator.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';

export type O63ColorSwatchProps = {
  id?: string;
  scrollComponent?: boolean;
  color: string;
  label: A04EyebrowProps;
  tooltip: M44CopyProgressIndicatorProps;
  hexLabel: A04EyebrowProps;
};
