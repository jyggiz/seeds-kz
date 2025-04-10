import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O55PaginationTransitionController from './O55PaginationTransitionController';

import './o55-pagination.scss';
export default class O55Pagination extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o55-pagination';

  public readonly transitionController: O55PaginationTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O55PaginationTransitionController(this);
  }
}
