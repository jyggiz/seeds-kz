import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c56-full-width-media.scss';

export default class C56FullWidthMedia extends AbstractComponent {
  public static readonly displayName: string = 'c56-full-width-media';

  public adopted() {
    setAsInitialised(this.element);
  }
}
