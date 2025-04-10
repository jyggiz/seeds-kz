import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C54CountdownTimerTransitionController from './C54CountdownTimerTransitionController';

import './c54-countdown-timer.scss';

export default class C54CountdownTimer extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c54-countdown-timer';

  public readonly transitionController: C54CountdownTimerTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C54CountdownTimerTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
