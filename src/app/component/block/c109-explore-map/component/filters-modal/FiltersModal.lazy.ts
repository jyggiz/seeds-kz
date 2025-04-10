import AbstractComponent from 'app/component/AbstractComponent';
import App from 'app/component/layout/app/App';
import { getAppComponent } from 'app/util/getElementComponent';
import { MODAL } from 'app/util/overlayActionTypes';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './filters-modal.scss';

export default class FiltersModal extends AbstractComponent {
  public static readonly displayName: string = 'filters-modal';
  private closeButton = this.getElement('[data-close-modal]');
  private app: App | null = null;

  public async adopted(): Promise<void> {
    setAsInitialised(this.element);

    this.app = await getAppComponent();

    if (this.closeButton) {
      this.addDisposableEventListener(this.closeButton, 'click', async () => {
        if (!this.app) return;
        (await this.app.overlay).dispatchAction({ type: MODAL.CLOSE });
      });
    }
  }
}
