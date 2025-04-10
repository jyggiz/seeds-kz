import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O103CirclesGridTransitionController from './O103CirclesGridTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './o103-circles-grid.scss';
import M34ComponentBackground from 'app/component/molecule/m34-component-background/M34ComponentBackground';
import { StateClassNames } from 'app/data/enum/StateClassNames';

export default class O103CirclesGrid extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o103-circles-grid';

  public readonly transitionController: O103CirclesGridTransitionController;
  private circleItems = this.getElements('[data-circle-item]');
  private backgrounds = this.getElements(
    `[data-component="${M34ComponentBackground.displayName}"]`,
  );

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O103CirclesGridTransitionController(this);

    this.circleItems.forEach((circle, index) => {
      const background = this.backgrounds[index];

      this.addDisposableEventListener(circle, 'mouseenter', () => {
        background?.classList.add(StateClassNames.VISIBLE);
      });

      this.addDisposableEventListener(circle, 'mouseleave', () => {
        background?.classList.remove(StateClassNames.VISIBLE);
      });
    });
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
