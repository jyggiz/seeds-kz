import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { Power2, TweenMax } from 'gsap';
import { throttle } from 'lodash-es';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import eases from '../../../animation/eases';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { getComponentForElement } from 'muban-core';
import mq from '../../../data/shared-variable/media-queries.json';
import deviceStateTracker from '../../../util/deviceStateTracker';
import O27PanelNavigationTemplate from '../../organism/o27-panel-navigation/o27-panel-navigation.hbs?include';
import O27PanelNavigation from '../../organism/o27-panel-navigation/O27PanelNavigation';
import O29DropdownNavigationTemplate from '../../organism/o29-dropdown-navigation/o29-dropdown-navigation.hbs?include';
import O29DropdownNavigation from '../../organism/o29-dropdown-navigation/O29DropdownNavigation';
import O36SecondaryNavigation from '../../organism/o36-secondary-navigation/O36SecondaryNavigation';
import S01NavigationTransitionController from './S01NavigationTransitionController';
import O88SearchBar from '../../organism/o88-search-bar/O88SearchBar';
import M02Button from '../../molecule/m02-button/M02Button';
import O04LanguageSelector from '../../organism/o04-language-selector/O04LanguageSelector';
import { O04LanguageSelectorEvent } from '../../organism/o04-language-selector/O04LanguageSelector.utils';

type ScrollData = {
  offset: {
    y: number;
  };
  limit: {
    y: number;
  };
};

export default class S01Navigation extends AbstractTransitionBlock {
  public static displayName: string = 's01-navigation';
  public static THROTTLE_DELAY = 300;
  public transitionController: S01NavigationTransitionController;

  private readonly mask = this.getElement('[data-navigation-mask]');
  private readonly primaryNavigation = this.getElement('[data-primary-navigation]');
  private readonly navigationContainer = this.getElement('[data-navigation-container]');
  private readonly searchContainer = this.getElement('.b-navigation__search-container');
  private readonly closeSearchButton = this.getElement(
    `.b-navigation__search-container [data-component="${O88SearchBar.displayName}"] [data-component="${M02Button.displayName}"][type="button"]`,
  );
  private readonly search =
    this.searchContainer &&
    this.getComponent<O88SearchBar>(O88SearchBar.displayName, this.searchContainer);
  private readonly searchInput =
    this.search && this.getElement('[data-search]', this.search.element);

  private readonly o36SecondaryNavigation = this.getElement(
    `[data-component="${O36SecondaryNavigation.displayName}"]`,
    document.body,
  );

  private productionAemElement =
    document && document.getElementsByClassName('root responsivegrid')[0];
  private productionFirstBlock = this.productionAemElement?.getElementsByTagName(
    'section',
  )[0] as HTMLElement;

  private developmentFirstBlock = this.element.parentElement?.getElementsByTagName(
    'section',
  )[0] as HTMLElement;

  private isLargeDevice: boolean =
    deviceStateTracker.currentDeviceState.state > mq.deviceState.XXLARGE;
  private minimalNavigation: boolean = 'minimalNavigation' in this.element.dataset;
  private isDrawerNavigation: boolean = 'isDrawerNavigation' in this.element.dataset;
  private currentOffsetY: number = 0;
  private isScrolledLimit: number = 200;
  private scrollData: { offset: { y: number }; limit: { y: number } } = {
    offset: {
      y: 0,
    },
    limit: {
      y: this.isScrolledLimit,
    },
  };
  private isStickySearch: boolean = false;
  private isSearchEmpty: boolean = true;
  private isSearchOpen: boolean = false;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new S01NavigationTransitionController(this);

    this.isStickySearch = Boolean(this.searchContainer?.classList.contains('-isStickySearch'));

    if (this.isStickySearch) {
      this.element.classList.add(StateClassNames.SEARCH_OPEN);
      this.search?.element.setAttribute('data-full-width', 'true');
    }

    this.addEventListeners();

    !this.minimalNavigation && this.isLargeDevice && this.renderNavigation();
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    const wasLargeDevice = this.isLargeDevice;
    this.isLargeDevice = state > mq.deviceState.XXLARGE;
    if (wasLargeDevice !== this.isLargeDevice) {
      this.renderNavigation();
    }
  }

  private async renderNavigation(): Promise<void> {
    const { content } = this.element.dataset;
    if (!content) {
      throw new Error('No nav content found');
    }

    if (this.primaryNavigation === null) throw new Error('The Primary navigation was not found');

    const dropdownNavigationElement = this.getElement(
      `[data-component="${O29DropdownNavigation.displayName}"]`,
    );
    const panelNavigationElement = this.getElement(
      `[data-component="${O27PanelNavigation.displayName}"]`,
    );

    if (this.isLargeDevice) {
      this.element.classList.add('-isDropdown');
      panelNavigationElement && panelNavigationElement.remove();
      renderItem(this.primaryNavigation, O29DropdownNavigationTemplate, JSON.parse(content), true);
      const searchToggle = this.getElement(
        `.o-dropdownNavigation__section.-aside [data-component="${M02Button.displayName}"`,
      );
      searchToggle?.setAttribute('aria-expanded', 'false');
      searchToggle &&
        this.addDisposableEventListener(searchToggle, 'click', this.openSearch.bind(this));
    } else {
      this.element.classList.remove('-isDropdown');
      dropdownNavigationElement && dropdownNavigationElement.remove();
      renderItem(this.primaryNavigation, O27PanelNavigationTemplate, JSON.parse(content), true);
      this.setSyncSearchInputEventListener();
    }
  }

  public adopted() {
    this.setFirstBlockOptions();
    this.closeSecondaryNavigation();
  }

  private closeSecondaryNavigation() {
    const languageSelector = this.getElement(
      `[data-component="${O04LanguageSelector.displayName}"]`,
    );
    const secondaryNavigation = this.getElement(
      `[data-component="${O36SecondaryNavigation.displayName}"]`,
    );
    const secondaryNavigationComponent =
      secondaryNavigation && getComponentForElement<O36SecondaryNavigation>(secondaryNavigation);

    if (languageSelector) {
      const languageSelectorComponent =
        getComponentForElement<O04LanguageSelector>(languageSelector);

      if (languageSelectorComponent) {
        this.addDisposableEventListener(
          languageSelectorComponent.dispatcher,
          O04LanguageSelectorEvent.types.TOGGLE_DROPDOWN,
          () => {
            secondaryNavigationComponent?.closeOpenedList();
          },
        );
      }
    }
  }

  private setFirstBlockOptions() {
    const firstBlockComponent = this.productionAemElement
      ? this.productionFirstBlock
      : this.developmentFirstBlock;

    if (!firstBlockComponent) {
      return;
    }

    const blockClassList = firstBlockComponent.classList;
    if (
      !blockClassList.contains('-hasBackgroundImage') &&
      !blockClassList.contains('-hasBackgroundAsset') &&
      !blockClassList.contains('-dark')
    )
      this.element.classList.add('-backgroundTint');
  }

  private toggleScrollClassName(data: ScrollData) {
    this.element.classList.toggle(StateClassNames.SCROLLED, window.scrollY > data.offset.y);
  }

  private onScroll() {
    this.toggleScrollClassName(this.scrollData);

    this.scrollData.offset.y = window.scrollY <= 0 ? 0 : window.scrollY;

    if (this.isDrawerNavigation) {
      this.toggleNavbarDrawer(this.scrollData);
    } else if (this.search) {
      this.toggleSearchDrawer(this.scrollData);
    }

    this.element.classList.toggle(
      StateClassNames.SCROLLING_TOP,
      !this.element.classList.contains(StateClassNames.SCROLLED) && this.scrollData.offset.y != 0,
    );
  }

  private toggleSearchDrawer({ offset }: ScrollData) {
    if (offset.y > this.currentOffsetY && offset.y > this.isScrolledLimit) {
      if (this.isSearchOpen) {
        this.hideSearch();
      }
    } else if (offset.y < this.currentOffsetY) {
      if (this.isSearchEmpty && this.isSearchOpen) {
        this.hideSearch();
      }

      if (this.isStickySearch && window.scrollY === 0) {
        this.openSearch();
      }
    }

    this.updateCurrentOffsetY(offset.y);
  }

  private toggleNavbarDrawer({ offset, limit }: ScrollData): void {
    if (this.element.classList.contains(StateClassNames.OPEN)) return;

    if (this.navigationContainer) {
      const mainNavigationOffset = this.getMainNavigationOffset();

      if (offset.y > this.currentOffsetY && offset.y > this.isScrolledLimit) {
        TweenMax.to(this.element, 0.4, {
          y: -mainNavigationOffset,
          ease: eases.VinnieInOut,
          onComplete: () => {
            this.isStickySearch && this.hideSearch();
          },
        });
      } else if (offset.y < this.currentOffsetY) {
        this.isStickySearch && this.hideSearch();

        if (window.scrollY === 0) {
          this.isStickySearch && this.openSearch();
        }

        TweenMax.to(this.element, 0.4, {
          y: 0,
          ease: eases.VinnieInOut,
        });
      }
    }

    if (offset.y >= limit.y) offset.y = limit.y;

    this.updateCurrentOffsetY(offset.y);
  }

  private updateCurrentOffsetY(newValue: number) {
    setTimeout(() => {
      this.currentOffsetY = newValue;
    }, 150);
  }

  private openSearch(): void {
    this.element.classList.add(StateClassNames.SEARCH_OPEN);

    if (!this.isSearchOpen) {
      this.isSearchOpen = true;
      this.toggleExpandedState();
    }

    const dropdownNavigation = this.getComponent<O29DropdownNavigation>(
      O29DropdownNavigation.displayName,
    );

    dropdownNavigation?.closeNavigation();

    this.searchContainer &&
      TweenMax.to(this.searchContainer, 0.2, {
        display: 'block',
        y: 0,
        ease: eases.VinnieInOut,
        onComplete: () => {
          this.search?.focusInput();
        },
      });
  }

  private hideSearch(): void {
    this.element.classList.remove(StateClassNames.SEARCH_OPEN);
    this.isSearchOpen = false;
    this.toggleExpandedState();

    if (this.searchContainer == null) {
      return;
    }

    const offsetY = -this.getMainNavigationOffset();

    TweenMax.set(this.searchContainer, {
      display: 'none',
      y: offsetY,
      ease: eases.VinnieInOut,
    });
  }

  private getMainNavigationOffset(): number {
    const stickySearchHeight = this.searchContainer?.offsetHeight || 0;

    return this.o36SecondaryNavigation
      ? this.element.offsetHeight - this.o36SecondaryNavigation.offsetHeight + stickySearchHeight
      : this.element.offsetHeight + stickySearchHeight;
  }

  private closeNavigation() {
    const panelNavigation = this.getComponent<O27PanelNavigation>(O27PanelNavigation.displayName);
    const dropdownNavigation = this.getComponent<O29DropdownNavigation>(
      O29DropdownNavigation.displayName,
    );
    const isPanelNavigationOpen = panelNavigation?.element.classList.contains(StateClassNames.OPEN);
    if (!dropdownNavigation && !panelNavigation) throw new Error('The navigation is not found');

    isPanelNavigationOpen
      ? panelNavigation?.closeNavigation()
      : dropdownNavigation?.closeNavigation();
  }

  private toggleExpandedState() {
    const dropdownNavigation = this.getComponent<O29DropdownNavigation>(
      O29DropdownNavigation.displayName,
    );

    dropdownNavigation?.toggleExpanded();
  }

  private addEventListeners(): void {
    this.setSyncSearchInputEventListener();

    this.mask &&
      this.addDisposableEventListener(this.mask, 'click', this.closeNavigation.bind(this));

    !this.minimalNavigation &&
      this.addDisposableEventListener<DeviceStateEvent>(
        deviceStateTracker,
        DeviceStateEvent.STATE_UPDATE,
        (event) => this.onDeviceStateChange(event.data),
      );

    this.addDisposableEventListener(
      window,
      'scroll',
      throttle(this.onScroll.bind(this), S01Navigation.THROTTLE_DELAY),
    );

    this.closeSearchButton &&
      this.addDisposableEventListener(this.closeSearchButton, 'click', this.hideSearch.bind(this));

    this.searchInput &&
      this.addDisposableEventListener(this.searchInput, 'input', this.onSearchInput.bind(this));
  }

  private onSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.isSearchEmpty = !target.value;
  }

  private setSyncSearchInputEventListener(): void {
    if (!this.isStickySearch) {
      return;
    }

    const stickySearchInput = this.getElement<HTMLInputElement>(
      '.b-navigation__search-container .a-input__input',
    );
    const mobileSearchInput = this.getElement<HTMLInputElement>(
      `[data-component="${O27PanelNavigation.displayName}"] .a-input__input`,
    );

    if (!stickySearchInput || !mobileSearchInput) {
      return;
    }

    [stickySearchInput, mobileSearchInput].forEach((element) => {
      element &&
        this.addDisposableEventListener<Event>(element, 'change', (event) => {
          const value = (event.target as HTMLInputElement)?.value;
          const anotherInput =
            element === stickySearchInput ? mobileSearchInput : stickySearchInput;

          if (!anotherInput) {
            return;
          }

          anotherInput.value = value;
        });
    });
  }

  public set navigationOpen(isOpen: boolean) {
    isOpen
      ? this.element.classList.add(StateClassNames.OPEN)
      : this.element.classList.remove(StateClassNames.OPEN);
  }

  public set elementHidden(isHidden: boolean) {
    TweenMax.to(this.element, 0.4, {
      autoAlpha: isHidden ? 0 : 1,
      ease: Power2.easeInOut,
    });
  }
}
