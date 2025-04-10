import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C76ButtonReferenceTransitionController from './C76ButtonReferenceTransitionController';

import './c76-button-reference.scss';

export default class C76ButtonReference extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c76-button-reference';

  public readonly transitionController: C76ButtonReferenceTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C76ButtonReferenceTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
