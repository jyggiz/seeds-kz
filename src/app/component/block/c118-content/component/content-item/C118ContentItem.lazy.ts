import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c118-content-item.scss';

export default class Content extends AbstractComponent {
  public static readonly displayName: string = 'c118-content-item';

  public adopted() {
    setAsInitialised(this.element);
  }
}
