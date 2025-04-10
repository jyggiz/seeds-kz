import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import M51RegionPropertyTransitionController from './M51RegionPropertyTransitionController';

export default class M51RegionProperty extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm51-region-property';

  public readonly transitionController: M51RegionPropertyTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new M51RegionPropertyTransitionController(this);
  }
}
