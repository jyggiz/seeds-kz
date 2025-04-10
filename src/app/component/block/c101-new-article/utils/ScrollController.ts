import { scrollToAsync } from '../../../../util/scrollToAsync';

export class ScrollController {
  private _isAutoScrolling: boolean;

  constructor(isAutoScrolling: boolean = false) {
    this._isAutoScrolling = isAutoScrolling;
  }

  public scrollToAsync(y: number): void {
    this._isAutoScrolling = true;
    scrollToAsync({
      top: y,
      behavior: 'smooth',
    }).then(() => (this._isAutoScrolling = false));
  }

  public get isAutoScrolling(): boolean {
    return this._isAutoScrolling;
  }

  public scrollToElement(element: HTMLElement, extraOffset: number = 0): void {
    this.scrollToAsync(element.getBoundingClientRect().top + window.pageYOffset + extraOffset);
  }
}
