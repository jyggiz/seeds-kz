import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C52FactsFiguresTransitionController from './C52FactsFiguresTransitionController';

import './c52-facts-figures.scss';

export default class C52FactsFigures extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c52-facts-figures';

  public readonly transitionController: C52FactsFiguresTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C52FactsFiguresTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
