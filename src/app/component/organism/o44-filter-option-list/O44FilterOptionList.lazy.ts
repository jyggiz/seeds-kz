import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O44FilterOptionListTransitionController from './O44FilterOptionListTransitionController';

import './o44-filter-option-list.scss';
export default class O44FilterOptionList extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o44-filter-option-list';

  public readonly transitionController: O44FilterOptionListTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O44FilterOptionListTransitionController(this);
  }
}
