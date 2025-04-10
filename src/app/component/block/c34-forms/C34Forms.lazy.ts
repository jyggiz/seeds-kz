import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C34FormsTransitionController from './C34FormsTransitionController';

export default class C34Forms extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c34-forms';

  public readonly transitionController: C34FormsTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C34FormsTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
