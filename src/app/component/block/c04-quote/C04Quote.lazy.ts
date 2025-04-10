import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C04QuoteTransitionController from './C04QuoteTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c04-quote.scss';

export default class C04Quote extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c04-quote';

  public readonly transitionController: C04QuoteTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C04QuoteTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
  }
}
