import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C28FactsAndFiguresTransitionController from './C28FactsAndFiguresTransitionController';

import './c28-facts-and-figures.scss';

export default class C28FactsAndFigures extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c28-facts-and-figures';

  public readonly transitionController: C28FactsAndFiguresTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C28FactsAndFiguresTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
