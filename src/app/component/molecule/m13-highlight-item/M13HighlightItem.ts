import HighlightItemTransitionController from './M13HighlightItemTransitionController';
import AbstractTransitionComponent from '../../AbstractTransitionComponent';

export default class M13HighlightItem extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm13-highlight-item';

  public readonly transitionController: HighlightItemTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new HighlightItemTransitionController(this);
  }
}
