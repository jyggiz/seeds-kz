import AbstractComponent from '../../AbstractComponent';
import { addEventListener } from 'seng-disposable-event-listener';
import { DisposableManager } from 'seng-disposable-manager';
import domFocusLock from 'dom-focus-lock';
import O27PanelNavigation from '../o27-panel-navigation/O27PanelNavigation';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class O22MobileLanguageSelector extends AbstractComponent {
  public static readonly displayName: string = 'o22-mobile-language-selector';
  private disposableManager: DisposableManager = new DisposableManager();
  private dropdownActive: boolean = false;
  private readonly toggleElement: HTMLElement;
  public readonly mobileNavigation = this.getElement(
    `[data-component="${O27PanelNavigation.displayName}"]`,
    document.body,
  );

  constructor(el: HTMLElement) {
    super(el);
    this.toggleElement = <HTMLElement>this.getElement('[data-toggle]');
    this.addEventListeners();
  }

  private addEventListeners = (): void => {
    this.disposableManager.add(
      addEventListener(this.toggleElement, 'click', this.toggleDropdown.bind(this)),
    );
  };

  /**
   * @private
   * @method toggleDropdown
   */
  public toggleDropdown = (): Promise<void> => {
    if (!this.dropdownActive) {
      return this.open();
    }

    return this.close();
  };

  private async open(): Promise<void> {
    if (this.mobileNavigation) {
      this.mobileNavigation.classList.add(StateClassNames.HIDDEN);
    }

    this.element.classList.add(StateClassNames.ACTIVE);

    domFocusLock.on(this.element);
    this.dropdownActive = true;
  }

  private async close(): Promise<void> {
    if (this.mobileNavigation) {
      this.mobileNavigation.classList.remove(StateClassNames.HIDDEN);
    }

    this.element.classList.remove(StateClassNames.ACTIVE);

    domFocusLock.off(this.element);
    this.dropdownActive = false;
  }

  public dispose() {
    super.dispose();
  }
}
