import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C26HeroBannerTransitionController from './C26HeroBannerTransitionController';

export default class C26HeroBanner extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c26-hero-banner';

  public readonly transitionController: C26HeroBannerTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C26HeroBannerTransitionController(this);
  }

  public dispose() {
    super.dispose();
  }
}
