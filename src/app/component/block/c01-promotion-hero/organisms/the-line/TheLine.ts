import AbstractTransitionComponent from '../../../../AbstractTransitionComponent';
import TheLineTransitionController from './TheLineTransitionController';
import A05Moustache from '../../../../atom/a05-moustache/A05Moustache';
import M02Button from '../../../../molecule/m02-button/M02Button';
import { getAppComponent } from '../../../../../util/getElementComponent';
import App from '../../../../layout/app/App';

export default class TheLine extends AbstractTransitionComponent {
  public static displayName: string = 'the-line';

  public transitionController: TheLineTransitionController;

  public readonly logo = this.getElement('[data-logo]');
  public readonly moustache = this.getElement(`[data-component="${A05Moustache.displayName}"]`);
  public readonly buttons = this.getElements(
    `[data-buttons] > [data-component="${M02Button.displayName}"]`,
  );

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new TheLineTransitionController(this);
  }

  public async adopted() {
    if (!window.location.href.includes('viewMode=story')) {
      this.app = await getAppComponent();
    }
  }

  public dispose() {
    super.dispose();
  }
}
