import { setAsInitialised } from 'app/util/setAsInitialised';
import { getAppComponent } from 'app/util/getElementComponent';
import AbstractComponent from 'app/component/AbstractComponent';
import { C00DummyEvent } from './C00Dummy.utils';

import './c00-dummy.scss';

export default class C00Dummy extends AbstractComponent {
  public static readonly displayName: string = 'c00-dummy';

  public async adopted() {
    setAsInitialised(this.element);

    const app = await getAppComponent();
    const navHeight = await app.getNavigationHeight();
    this.dispatcher.dispatchEvent(
      new C00DummyEvent(C00DummyEvent.types.NAVIGATION_HEIGHT, navHeight),
    );
    this.element.style.height = `${navHeight}px`;
  }
}
