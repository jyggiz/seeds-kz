import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C13404ErrorTransitionController from './C13WarningMessageTransitionController';

import './c13-warning-message.scss';

export default class C13WarningMessage extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c13-warning-message';

  public readonly transitionController: C13404ErrorTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C13404ErrorTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
