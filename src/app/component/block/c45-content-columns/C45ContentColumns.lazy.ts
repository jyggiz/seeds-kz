import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C45ContentColumnsTransitionController from './C45ContentColumnsTransitionController';
import { openSharePopup } from '../../../util/OpenSharePopup';

import './c45-content-columns.scss';

export default class C45ContentColumns extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c45-content-columns';

  public readonly transitionController: C45ContentColumnsTransitionController;
  private readonly shareButton = this.getElement('[data-share-button]');

  constructor(el: HTMLElement) {
    super(el);

    this.addEventListeners();

    this.transitionController = new C45ContentColumnsTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private addEventListeners(): void {
    this.shareButton &&
      this.addDisposableEventListener(this.shareButton, 'click', () =>
        openSharePopup(this.shareButton),
      );
  }
}
