import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { openSharePopup } from '../../../../../../../util/OpenSharePopup';

import './buttons.scss';

export default class ContentButtons extends AbstractComponent {
  public static readonly displayName: string = 'buttons';

  private readonly shareButton = this.getElement('[data-share-button]');

  constructor(el: HTMLElement) {
    super(el);

    this.addEventListeners();
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
