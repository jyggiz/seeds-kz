import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O102CardsGridTransitionController from './O102CardsGridTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './o102-cards-grid.scss';

export default class O102CardsGrid extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o102-cards-grid';

  public readonly transitionController: O102CardsGridTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O102CardsGridTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
