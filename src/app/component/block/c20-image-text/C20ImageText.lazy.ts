import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C20ImageTextTransitionController from './C20ImageTextTransitionController';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c20-image-text.scss';

export default class C20ImageText extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c20-image-text';

  public readonly transitionController: C20ImageTextTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C20ImageTextTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
