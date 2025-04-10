import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C116DynamicCarouselTransitionController from './C116DynamicCarouselTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c116-dynamic-carousel.scss';

export default class C116DynamicCarousel extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c116-dynamic-carousel';

  public readonly transitionController: C116DynamicCarouselTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C116DynamicCarouselTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
