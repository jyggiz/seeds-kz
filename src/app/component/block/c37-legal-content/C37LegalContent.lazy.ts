import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C37LegalContentTransitionController from './C37LegalContentTransitionController';

import './c37-legal-content.scss';

export default class C37LegalContent extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c37-legal-content';

  public gradientColors: Array<string> =
    this.element.dataset.gradientColors && JSON.parse(this.element.dataset.gradientColors);
  public webglAsset = <string>this.element.dataset.asset;
  public readonly transitionController: C37LegalContentTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C37LegalContentTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
  }
}
