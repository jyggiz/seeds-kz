import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C24ContentTransitionController from './C24ContentTransitionController';

import './c24-content.scss';
import O30ContentGrid from 'app/component/organism/o30-content-grid/O30ContentGrid.lazy';

export default class C24Content extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c24-content';

  private readonly o30ContentGrid = this.getComponent<O30ContentGrid>(O30ContentGrid.displayName);

  public readonly transitionController: C24ContentTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C24ContentTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);

    this.o30ContentGrid?.updateStickyBackgroundHeight();
  }
}
