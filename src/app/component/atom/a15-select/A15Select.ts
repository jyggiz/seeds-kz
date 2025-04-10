import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import A15SelectTransitionController from './A15SelectTransitionController';

export default class A15Select extends AbstractTransitionComponent {
  public static readonly displayName: string = 'a15-select';

  public readonly transitionController: A15SelectTransitionController;

  private _select = this.getElement<HTMLSelectElement>('[data-select]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new A15SelectTransitionController(this);
  }

  public get select(): HTMLSelectElement {
    if (!this._select) {
      throw new Error('Could not find [data-select]');
    }
    return this._select;
  }

  public setOptions(options: Array<HTMLOptionElement>) {
    const firstOption = this.select.options.item(0);
    this.select.options.length = firstOption && firstOption.value === '' ? 1 : 0;
    options.forEach((option) => this.select.options.add(option));
  }
}
