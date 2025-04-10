import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';
import { O61TimerProps } from './../../organism/o61-timer/O61Timer.types';
import { M34ComponentBackgroundProps } from './../../molecule/m34-component-background/M34ComponentBackground.types';
import { HorizontalAlignmentTypes } from '../../../data/interface/Alignment';
import M04ComponentHeaderProps from 'app/component/molecule/m04-component-header/M04ComponentHeader.types';
import M19LogoProps from 'app/component/molecule/m19-logo/M19Logo.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';

export type C54CountdownTimerProps = {
  id?: string;
  scrollComponent?: boolean;
  alignment: HorizontalAlignmentTypes;
  background: M34ComponentBackgroundProps;
  logo?: M19LogoProps;
  header?: M04ComponentHeaderProps;
  subheader?: A04EyebrowProps;
  timer: O61TimerProps;
  buttons?: Array<M02ButtonProps>;
};
