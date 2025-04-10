import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O81MotionSlideTransitionController from './O81MotionSlideTransitionController';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './o81-motion-slide.scss';
export default class O81MotionSlide extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o81-motion-slide';

  public readonly transitionController: O81MotionSlideTransitionController;

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O81MotionSlideTransitionController(this);
  }

  public async adopted() {
    setAsInitialised(this.element);
    if (!window.location.href.includes('viewMode=story')) {
      this.app = await getAppComponent();
    }
  }
}
