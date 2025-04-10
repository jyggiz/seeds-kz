import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O78TimelineCardTransitionController from './O78TimelineCardTransitionController';

import './o78-timeline-card.scss';
export default class O78TimelineCard extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o78-timeline-card';

  public readonly transitionController: O78TimelineCardTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O78TimelineCardTransitionController(this);
  }
}
