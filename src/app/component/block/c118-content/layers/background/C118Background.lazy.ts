import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c118-background.scss';

export default class C118Background extends AbstractComponent {
  public static readonly displayName: string = 'c118-background';

  public adopted() {
    setAsInitialised(this.element);
  }
}
