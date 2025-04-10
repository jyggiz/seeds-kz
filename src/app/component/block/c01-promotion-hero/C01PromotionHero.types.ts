import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { TheLineProps } from './organisms/the-line/TheLine.types';

/**
 * In the future when this component gets expanded to more promotions add the id here. At the moment the only possible value is `the-line`.
 * */
export type PromotionID = 'the-line';

export type C01PromotionHeroProps = {
  background: M34ComponentBackgroundProps;
} & {
  promotionID: 'the-line';
  content: TheLineProps;
};
