import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class JourneyCard extends AbstractComponent {
  public static readonly displayName: string = 'journey-card';

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted(): Promise<void> {
    setAsInitialised(this.element);
  }
}
