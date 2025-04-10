import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C51LogosTransitionController from './C51LogosTransitionController';

import './c51-logos.scss';

export default class C51Logos extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c51-logos';
  public readonly transitionController: C51LogosTransitionController;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new C51LogosTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
