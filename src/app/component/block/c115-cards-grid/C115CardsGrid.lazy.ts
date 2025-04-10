import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C115CardsGridTransitionController from './C115CardsGridTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c115-cards-grid.scss';

export default class C115CardsGrid extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c115-cards-grid';

  public readonly transitionController: C115CardsGridTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C115CardsGridTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
