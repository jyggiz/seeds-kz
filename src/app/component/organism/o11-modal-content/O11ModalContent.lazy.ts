import AbstractComponent from 'app/component/AbstractComponent';

import './o11-modal-content.scss';

export default class O11ModalContent extends AbstractComponent {
  public static readonly displayName: string = 'o11-modal-content';

  constructor(el: HTMLElement) {
    super(el);
  }
}
