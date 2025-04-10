import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C09ContentGroupTransitionController from './C09ContentGroupTransitionController';

import './c09-content-group.scss';

export default class C09ContentGroup extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c09-content-group';

  public readonly transitionController: C09ContentGroupTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C09ContentGroupTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
  }
}
