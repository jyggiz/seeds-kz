import AbstractComponent from 'app/component/AbstractComponent';
import addRippleEffect from '../../../animation/addRippleEffect';

export default class M15ActionButton extends AbstractComponent {
  public static readonly displayName: string = 'm15-action-button';
  private readonly buttonContainer: HTMLElement | null = this.getElement(
    '[data-action-button-container]',
  );

  public adopted() {
    this.disposables.add(addRippleEffect(<HTMLDivElement>this.buttonContainer));
  }
}
