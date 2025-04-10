import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c102-social-media.scss';

export default class C102SocialMedia extends AbstractComponent {
  public static readonly displayName: string = 'c102-social-media';

  public adopted() {
    setAsInitialised(this.element);
  }
}
