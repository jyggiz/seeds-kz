import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C01PromotionHeroTransitionController from './C01PromotionHeroTransitionController';
import { PromotionID } from './C01PromotionHero.types';

export default class C01PromotionHero extends AbstractTransitionBlock {
  public static displayName: string = 'c01-promotion-hero';

  public transitionController: C01PromotionHeroTransitionController;

  public readonly promotionID = this.element.dataset.promotionId as PromotionID;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C01PromotionHeroTransitionController(this);
  }
}
