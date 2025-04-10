import AbstractComponent from 'app/component/AbstractComponent';

export default class M14ToggleButton extends AbstractComponent {
  public static readonly displayName: string = 'm14-toggle-button';

  public setExpanded(value: boolean): void {
    this.element.setAttribute('aria-expanded', `${value}`);
  }
}
