import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C118ContentTransitionController from './C118ContentTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c118-content.scss';

export default class C118Content extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c118-content';

  public readonly transitionController: C118ContentTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C118ContentTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
