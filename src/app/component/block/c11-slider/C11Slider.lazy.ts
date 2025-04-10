import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C11SliderTransitionController from './C11SliderTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c11-slider.scss';

export default class C11Slider extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c11-slider';

  public readonly transitionController: C11SliderTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C11SliderTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
