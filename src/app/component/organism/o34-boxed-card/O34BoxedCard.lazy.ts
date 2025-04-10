import AbstractComponent from 'app/component/AbstractComponent';
import M06Link from 'app/component/molecule/m06-link/M06Link';

import './o34-boxed-card.scss';

export default class O34BoxedCard extends AbstractComponent {
  public static readonly displayName: string = 'o34-boxed-card';

  private readonly headingLink = this.getElement('[data-heading-link]');

  constructor(el: HTMLElement) {
    super(el);
  }

  public hasModal(): boolean {
    return this.element.hasAttribute('data-modal');
  }

  public isHeadingLink(currentElement: HTMLElement): boolean {
    return currentElement === this.headingLink;
  }
}
