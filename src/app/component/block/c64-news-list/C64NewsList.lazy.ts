import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import C64NewsListTransitionController from './C64NewsListTransitionController';

import './c64-news-list.scss';

export default class C64NewsList extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c64-news-list';

  public readonly transitionController: C64NewsListTransitionController;

  private readonly playButtons = this.getElements('[data-play-button]');

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C64NewsListTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.app = await getAppComponent();
  }

  public dispose() {
    super.dispose();
  }
}
