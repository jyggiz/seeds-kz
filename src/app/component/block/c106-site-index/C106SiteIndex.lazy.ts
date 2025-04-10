import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C106SiteIndexTransitionController from './C106SiteIndexTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class C106SiteIndex extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c106-site-index';

  public readonly transitionController: C106SiteIndexTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C106SiteIndexTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
