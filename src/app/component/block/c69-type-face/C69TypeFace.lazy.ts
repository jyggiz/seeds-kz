import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C69TypeFaceTransitionController from './C69TypeFaceTransitionController';

import './c69-type-face.scss';

export default class C69TypeFace extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c69-type-face';

  public readonly transitionController: C69TypeFaceTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C69TypeFaceTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
