import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './o101-video-content.scss';

export default class O101VideoContent extends AbstractComponent {
  public static readonly displayName: string = 'o101-video-content';

  public adopted() {
    setAsInitialised(this.element);
  }
}
