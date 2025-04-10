import AbstractComponent from 'app/component/AbstractComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O01Video from 'app/component/organism/o01-video/O01Video.lazy';

import './c111-modal-window.scss';

export default class C111ModalWindow extends AbstractComponent {
  public static readonly displayName: string = 'c111-modal-window';
  private videoComponent = this.getComponent<O01Video>(O01Video.displayName);

  constructor(el: HTMLElement) {
    super(el);
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  public dispose(): void {
    this.videoComponent?.player.pause();
  }
}
