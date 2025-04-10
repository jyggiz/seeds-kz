import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';

export default class C120Contacts extends AbstractComponent {
  public static readonly displayName: string = 'c120-contacts';
  private readonly infoContainer = this.getElement('[data-info-container]');

  constructor(el: HTMLElement) {
    super(el);
  }

  public async adopted() {
    setAsInitialised(this.element);

    const map = document.getElementById('map');

    if (map && (this.infoContainer?.clientWidth || 0) < 560) {
      map.style.width = `${this.infoContainer?.clientWidth}px`
    }
  }
}
