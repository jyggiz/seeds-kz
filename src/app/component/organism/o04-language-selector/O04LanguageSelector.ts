import eases from 'app/animation/eases';
import AbstractComponent from 'app/component/AbstractComponent';
import domFocusLock from 'dom-focus-lock';
import { TweenMax } from 'gsap';
import { addEventListener } from 'seng-disposable-event-listener';
import { DisposableManager } from 'seng-disposable-manager';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import { Key } from 'ts-key-enum';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { O04LanguageSelectorEvent } from './O04LanguageSelector.utils';

export default class O04LanguageSelector extends AbstractComponent {
  public static readonly displayName: string = 'o04-language-selector';
  private app: App | null = null;
  private disposableManager: DisposableManager = new DisposableManager();
  private dropdownActive: boolean = false;
  private readonly toggleElement: HTMLElement;
  private readonly languageList = this.getElement('[data-language-list]') as HTMLElement;

  constructor(el: HTMLElement) {
    super(el);
    this.toggleElement = <HTMLElement>this.getElement('[data-toggle]');
    this.toggleElement && this.addEventListeners();
  }

  private addEventListeners = (): void => {
    this.disposableManager.add(
      addEventListener(this.toggleElement, 'click', this.toggleDropdown.bind(this)),
    );

    this.addDisposableEventListener(this.element, 'keydown', this.onEscapeKeyPress.bind(this));
  };

  private onEscapeKeyPress(event: KeyboardEvent) {
    if (event.key !== Key.Escape) return;

    this.close();
  }

  /**
   * @private
   * @method toggleDropdown
   */
  public toggleDropdown = (): Promise<void> => {
    this.dispatcher.dispatchEvent(
      new O04LanguageSelectorEvent(O04LanguageSelectorEvent.types.TOGGLE_DROPDOWN),
    );

    if (!this.dropdownActive) {
      return this.open();
    }

    return this.close();
  };

  private set scrollEnabled(isEnabled: boolean) {
    if (!this.app) {
      throw new Error('The app component cannot be found');
    }

    this.app.toggleScroll(isEnabled);
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private async open(): Promise<void> {
    this.element.classList.add(StateClassNames.EXPANDED);
    this.toggleElement && this.toggleElement.setAttribute('aria-expanded', 'true');

    if (this.languageList) {
      const languageListArray = Array.from(this.languageList.children);
      TweenMax.staggerFromTo(
        languageListArray.filter((element) => element !== null),
        0.4,
        {
          y: 150,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
          stagger: {
            amount: languageListArray.length > 5 ? 0.5 : 0.3,
          },
        },
        0,
      );
    }

    domFocusLock.on(this.element);

    this.dropdownActive = true;
    this.scrollEnabled = false;
  }

  private async close(): Promise<void> {
    this.element.classList.remove(StateClassNames.EXPANDED);
    this.toggleElement && this.toggleElement.setAttribute('aria-expanded', 'false');

    domFocusLock.off(this.element);

    this.dropdownActive = false;
    this.scrollEnabled = true;
  }

  public dispose() {
    super.dispose();
  }
}
