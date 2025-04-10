import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c98-breadcrumbs.scss';

export default class C98Breadcrumbs extends AbstractComponent {
  public static readonly displayName: string = 'c98-breadcrumbs';

  public adopted() {
    setAsInitialised(this.element);
  }
}
