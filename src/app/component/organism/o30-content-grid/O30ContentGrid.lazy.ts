import AbstractComponent from 'app/component/AbstractComponent';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { openSharePopup } from '../../../util/OpenSharePopup';

import './o30-content-grid.scss';
import M34ComponentBackground from 'app/component/molecule/m34-component-background/M34ComponentBackground';

export default class O30ContentGrid extends AbstractComponent {
  public static readonly displayName: string = 'o30-content-grid';

  private readonly shareButton = this.getElement('[data-share-button]');
  private readonly m34ComponentBackground = this.getComponent<M34ComponentBackground>(
    M34ComponentBackground.displayName,
  );
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.shareButton &&
      this.addDisposableEventListener(this.shareButton, 'click', () =>
        openSharePopup(this.shareButton),
      );
  }

  public updateStickyBackgroundHeight(): void {
    if (!this.m34ComponentBackground?.stickyBackgroundElement) {
      return;
    }

    const HEIGHT_FOR_PARALLAX_EFFECT = 150;

    this.m34ComponentBackground.stickyBackgroundElement.style.height = `${HEIGHT_FOR_PARALLAX_EFFECT}%`;
  }
}
