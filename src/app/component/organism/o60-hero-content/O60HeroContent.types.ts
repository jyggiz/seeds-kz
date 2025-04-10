import { Alignment } from '../../../data/interface/Alignment';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import A01ImageProps, { A01ImageDirection } from '../../atom/a01-image/A01Image.types';
import { M53TileCtaProps } from '../../molecule/m53-tile-cta/M53TileCta.types';
import M06LinkProps from '../../molecule/m06-link/M06Link.types';
import { M58PillarCtaProps } from 'app/component/molecule/m58-pillar-cta/M58PillarCta.types';
import { O98MegaButtonsInvestFormProps } from '../o98-mega-buttons-invest-form/O98MegaButtonsInvestForm.types';

export type O60HeroContentProps = {
  align: Alignment;
  background: M34ComponentBackgroundProps;
  centralizedButtons?: boolean;
  content: {
    link?: M06LinkProps;
    header: Omit<M04ComponentHeaderProps, 'alignment'>;
  } & (
    | {
        buttons: Array<M02ButtonProps>;
        buttonType: 'regular';
        buttonEyebrow?: never;
      }
    | {
        buttons: Array<
          M53TileCtaProps & { heroBackgroundImageOnHover?: M34ComponentBackgroundProps }
        >;
        buttonType: 'tile';
        buttonEyebrow?: string;
        buttonContentDirection?: 'row';
      }
    | {
        buttons: Array<
          M58PillarCtaProps & { heroBackgroundImageOnHover?: M34ComponentBackgroundProps }
        >;
        buttonType: 'pillar' | 'pillar-short';
        buttonEyebrow?: never;
      }
    | {
        buttons: O98MegaButtonsInvestFormProps;
        buttonType: 'mega-buttons-invest-form';
        buttonEyebrow?: never;
      }
    | {
        buttons?: never;
        buttonType?: never;
        buttonEyebrow?: never;
      }
  );
  scrollButton?: boolean;
  scrollComponent?: boolean;
  transitionDirection?: A01ImageDirection;
};
