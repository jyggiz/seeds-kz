import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './content.scss';

export default class Content extends AbstractComponent {
  public static readonly displayName: string = 'content-item-content';

  public adopted() {
    setAsInitialised(this.element);
  }
}
