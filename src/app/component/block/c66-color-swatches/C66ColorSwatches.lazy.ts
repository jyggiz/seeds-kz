import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C66ColorSwatchesTransitionController from './C66ColorSwatchesTransitionController';

import './c66-color-swatches.scss';

export default class C66ColorSwatches extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c66-color-swatches';

  public readonly transitionController: C66ColorSwatchesTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C66ColorSwatchesTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
