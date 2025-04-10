import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c000-heading.scss';

export default class C000Heading extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c000-heading';

  constructor(el: HTMLElement) {
    super(el);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
