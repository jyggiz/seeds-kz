import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C44ArticleContentTransitionController from './C44ArticleContentTransitionController';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import { openSharePopup } from '../../../util/OpenSharePopup';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c44-article-content.scss';

export default class C44ArticleContent extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c44-article-content';

  public readonly transitionController: C44ArticleContentTransitionController;

  private readonly shareButton = this.getElement('[data-share-button]');
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C44ArticleContentTransitionController(this);

    this.addEventListeners();
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.shareButton &&
      this.addDisposableEventListener(this.shareButton, 'click', () =>
        openSharePopup(this.shareButton),
      );
  }
}
