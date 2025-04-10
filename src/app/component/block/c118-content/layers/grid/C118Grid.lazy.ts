import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c118-grid.scss';

export default class C118Grid extends AbstractComponent {
  public static readonly displayName: string = 'c118-grid';

  public adopted() {
    setAsInitialised(this.element);
  }
}
