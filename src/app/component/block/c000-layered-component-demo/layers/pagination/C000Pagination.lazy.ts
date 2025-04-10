import AbstractComponent from 'app/component/AbstractComponent';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { PaginationComponents } from '../../C000LayeredComponentDemo.types';

import './c000-pagination.scss';

export default class C000Pagination extends AbstractComponent {
  public static readonly displayName: string = 'c000-pagination';
  private readonly paginationElements = this._paginationElements;

  constructor(el: HTMLElement) {
    super(el);

    this.activateElement(0);
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private activateElement(index: number) {
    this.paginationElements[index].classList.add(StateClassNames.ACTIVE);
  }

  // API methods
  public selectElements() {
    return this.paginationElements;
  }

  // getters
  private get _paginationElements() {
    const m48Element = this.getElement(`[data-component="${PaginationComponents.M48}"]`);
    if (m48Element) {
      const paginationElements = this.getElements(`[data-pagination-bar]`, m48Element);

      return paginationElements;
    }

    throw new Error('Could not find pagination title elements');
  }
}
