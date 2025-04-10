import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O73SubmitStepTransitionController from './O73SubmitStepTransitionController';

import './o73-submit-step.scss';
export default class O73SubmitStep extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o73-submit-step';

  public readonly transitionController: O73SubmitStepTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O73SubmitStepTransitionController(this);
  }
}
