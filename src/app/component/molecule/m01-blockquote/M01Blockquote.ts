import AbstractComponent from 'app/component/AbstractComponent';

export default class M01Blockquote extends AbstractComponent {
  public static readonly displayName: string = 'm01-blockquote';

  constructor(el: HTMLElement) {
    super(el);
  }

  public dispose() {
    super.dispose();
  }
}
