import { getComponentForElement } from 'muban-core';
import AbstractComponent from '../../AbstractComponent';
import M31DropdownField from '../m31-dropdown-field/M31DropdownField.lazy';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './m52-stylized-option.scss';

const dropdownComponents = {
  M31: 'm31-dropdown-field',
} as const;

type DropdownComponentInstance = (parent: AbstractComponent) => M31DropdownField | undefined;

type DropdownComponentsKeys = keyof typeof dropdownComponents;

export type DropdownComponentsNames = (typeof dropdownComponents)[DropdownComponentsKeys];

const dropdownComponentsInstances: Record<DropdownComponentsNames, DropdownComponentInstance> = {
  [dropdownComponents.M31]: (parent: AbstractComponent) => {
    const element = parent.getElement(`[data-component="${dropdownComponents.M31}"]`);
    if (element) {
      const component = getComponentForElement<M31DropdownField>(element);
      return component;
    }
  },
};
export default class M52StylizedOption extends AbstractComponent {
  public static readonly displayName: string = 'm52-stylized-option';
  private readonly dependentDropdownComponent = this._dependentDropdownComponent;
  private readonly label = this._label;
  private readonly input = this._input;
  private isEventClick = false;
  private onLabelFocusTimeout: null | number = null;

  constructor(el: HTMLElement) {
    super(el);

    if (this.dependentDropdownComponent) {
      this.setDropdownVisibility(false);
    }

    this.focusInputOnLabelFocus();
    this.checkForClickEvent();
  }

  private checkForClickEvent() {
    this.addDisposableEventListener(this.element, 'click', () => {
      this.isEventClick = true;
    });

    this.addDisposableEventListener(this.element, 'keypress', () => {
      this.isEventClick = false;
    });
  }

  private focusInputOnLabelFocus() {
    this.addDisposableEventListener(this.label, 'focus', () => {
      this.onLabelFocusTimeout = setTimeout(this.onLabelFocus.bind(this), 100);
    });
  }

  private onLabelFocus() {
    this.input.focus();

    if (!this.isEventClick) {
      this.label.classList.add('focus-visible');
      this.removeLabelFocusOnInputBlur();
    }
  }

  private removeLabelFocusOnInputBlur() {
    this.addDisposableEventListener(this.input, 'blur', () => {
      this.label.classList.remove('focus-visible');
    });
  }

  public onUncheck() {
    if (this.dependentDropdownComponent) {
      this.setDropdownVisibility(false);
      this.dependentDropdownComponent.selectElement.setAttribute('data-block-validation', '');
      this.dependentDropdownComponent.selectElement.setAttribute('disabled', '');
    }
  }

  public onCheck() {
    if (this.dependentDropdownComponent) {
      this.setDropdownVisibility(true);
      this.dependentDropdownComponent.selectElement.removeAttribute('data-block-validation');
      this.dependentDropdownComponent.selectElement.removeAttribute('disabled');
    }
  }

  private setDropdownVisibility(shouldShow: boolean) {
    if (this.dependentDropdownComponent) {
      const display = shouldShow ? 'block' : 'none';
      this.dependentDropdownComponent.element.style.display = display;
    }
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  public dispose(): void {
    this.onLabelFocusTimeout && clearTimeout(this.onLabelFocusTimeout);
  }

  //getters
  private get _dependentDropdownComponent() {
    const componentName = this.element.dataset.dependentDropdown as DropdownComponentsNames;

    if (componentName) {
      const componentInstance = dropdownComponentsInstances[componentName](this);

      if (!componentInstance) {
        throw new Error('could not find dropdown component');
      }

      return componentInstance;
    }
  }

  private get _label() {
    const label = this.getElement('[data-label]');

    if (!label) {
      throw new Error('No label found');
    }

    return label;
  }

  private get _input() {
    const input = this.getElement<HTMLInputElement>('[data-stylized-input]');

    if (!input) {
      throw new Error('No input found');
    }

    return input;
  }
}
