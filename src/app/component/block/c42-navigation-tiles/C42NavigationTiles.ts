import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C42NavigationTilesTransitionController from './C42NavigationTilesTransitionController';

export default class C42NavigationTiles extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c42-navigation-tiles';

  public readonly transitionController: C42NavigationTilesTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C42NavigationTilesTransitionController(this);
  }
}
