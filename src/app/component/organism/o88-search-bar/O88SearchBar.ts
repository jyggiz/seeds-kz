import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import AbstractTransitionComponent from '../../AbstractTransitionComponent';
import { Key } from 'ts-key-enum';
import M02Button from '../../molecule/m02-button/M02Button';
import O88SearchBarTransitionController from './O88SearchBarTransitionController';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getComponentForElement } from 'muban-core';
import trackEvent, { TrackingEventNames } from 'app/util/TrackingEvent';

export default class O88SearchBar extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o88-search-bar';
  public static readonly searchParam: string = 'search';

  public readonly transitionController: O88SearchBarTransitionController;

  private submitButton = this.getElement(
    `.o-searchBar__actionContainer [data-component="${M02Button.displayName}"][type="submit"]`,
  );
  private readonly submitButtonComponent =
    this.submitButton && getComponentForElement<M02Button>(this.submitButton);
  private searchInput = this.getElement<HTMLInputElement>(`.a-input__input`);
  private searchForm = this.getElement<HTMLFormElement>('.o-searchBar__searchForm');
  private readonly IS_PLACEHOLDER_HIDDEN = '-isPlaceholderHidden';

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O88SearchBarTransitionController(this);

    this.addEventListeners();
    this.prefillSearchInput();
  }

  public adopted(): void {
    this.isFullWidth() && this.toggleDesktopOnlyState(true);
    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);
    this.submitButton?.classList.toggle(StateClassNames.DISABLED, !this.searchInput?.value);
    this.submitButtonComponent?.updateAriaDisabled();
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    const isLarge = state >= mq.deviceState.XXLARGE;
    const isFullWidth = this.isFullWidth();

    !isFullWidth && this.toggleDesktopOnlyState(isLarge);

    isFullWidth || isLarge
      ? this.addDesktopVersionEventListeners()
      : this.addMobileVersionEventListeners();
  }

  private onInputChange(event: Event): void {
    this.submitButton?.classList.toggle(
      StateClassNames.DISABLED,
      !(event.target as HTMLInputElement)?.value,
    );
    this.submitButtonComponent?.updateAriaDisabled();
  }

  private onInputSubmit(event: KeyboardEvent): void {
    if (event.key === Key.Enter) event.preventDefault();

    if (event.key === Key.Enter && this.searchInput?.value !== '') {
      this.searchForm && this.searchForm.submit();
    }
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    this.submitButton &&
      this.addDisposableEventListener(this.submitButton, 'click', (event: KeyboardEvent) => {
        event.preventDefault();

        if (this.submitButton?.classList.contains(StateClassNames.DISABLED)) return;
        if (this.searchInput?.value !== '' && this.searchForm) {
          trackEvent({
            event: TrackingEventNames.SEARCH,
            search_term: this.searchInput?.value || '',
          });
          this.searchForm.submit();
        }
      });
  }

  private addDesktopVersionEventListeners(): void {
    this.searchInput &&
      this.addDisposableEventListener(this.searchInput, 'input', this.onInputChange.bind(this));
  }

  private addMobileVersionEventListeners(): void {
    if (!this.searchInput) {
      return;
    }

    this.addDisposableEventListener(this.searchInput, 'keydown', this.onInputSubmit.bind(this));
    this.addDisposableEventListener(this.searchInput, 'focus', this.onInputFocus.bind(this));
    this.addDisposableEventListener(this.searchInput, 'focusout', this.onInputFocusOut.bind(this));
  }

  private isFullWidth(): boolean {
    return this.element.hasAttribute('data-full-width');
  }

  private toggleDesktopOnlyState(force?: boolean): void {
    this.element.classList.toggle('desktop-only', force);
  }

  private prefillSearchInput(): void {
    if (!this.searchInput) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get(O88SearchBar.searchParam) || '';

    this.searchInput.value = searchQuery;
  }

  private onInputFocus(): void {
    this.searchInput?.classList.add(this.IS_PLACEHOLDER_HIDDEN);
  }

  private onInputFocusOut(): void {
    if (this.searchInput?.value !== '') {
      return;
    }

    this.searchInput?.classList.remove(this.IS_PLACEHOLDER_HIDDEN);
  }

  public focusInput(): void {
    this.searchInput?.focus();
  }
}
