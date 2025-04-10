import AbstractComponent from '../../../../../AbstractComponent';
import { AuthorInfoProps } from '../../molecule/author-info/AuthorInfo.types';
import App from '../../../../../layout/app/App';
import { getAppComponent } from '../../../../../../util/getElementComponent';
import { MODAL } from '../../../../../../util/overlayActionTypes';

import './author-section.scss';

const lazyAuthorInfoTemplate = () =>
  import(
    '../../molecule/author-info/author-info.hbs?include'
  ) as LoadTemplateImport<AuthorInfoProps>;

export default class AuthorSection extends AbstractComponent {
  public static readonly displayName: string = 'author-section';
  private readonly nameButton = this.getElement('[data-name-button]');
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
    if (this.nameButton) {
      this.addDisposableEventListener(this.nameButton, 'click', this.onNameButtonClick);
    }
  }

  async adopted() {
    this.app = await getAppComponent();
  }

  private onNameButtonClick = async () => {
    const data = JSON.parse(<string>this.element.dataset.item);
    if (!data) {
      return;
    }
    const [authorInfoTemplate, overlay] = await Promise.all([
      lazyAuthorInfoTemplate(),
      this.app?.overlay,
    ]);
    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: authorInfoTemplate.default,
        data,
        options: { classnames: ['-isMinContent'] },
      },
    });
  };
}
