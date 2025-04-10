import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { getAppComponent } from 'app/util/getElementComponent';
import { TweenMax } from 'gsap';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import App from '../../layout/app/App';
import O31DropdownNavigationList from '../o31-dropdown-navigation-list/O31DropdownNavigationList';
import O29DropdownNavigationTransitionController from './O29DropdownNavigationTransitionController';
import { displayActiveMenuItems } from './diplayActiveMenuItems';
import getScrollbarWidth from 'app/util/getScrollbarWidth';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

export default class O29DropdownNavigation extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o29-dropdown-navigation';
  public readonly transitionController: O29DropdownNavigationTransitionController;

  private readonly navigationMenuItems = this.getElements('[data-navigation-menu]');
  private readonly navigationMenuButtons = this.getElements('[data-navigation-menu-button]');
  private readonly navigationMenuLists = this.getElements(
    `[data-component="${O31DropdownNavigationList.displayName}"]`,
  );
  private readonly navigationIndicator = this.getElement('[data-navigation-indicator]');
  private activeMenuButton: HTMLElement | null = this.getElement(
    `.${StateClassNames.ACTIVE}[data-navigation-item] [data-navigation-menu-button]`,
  );
  private activeLink: HTMLElement | null = this.getElement(
    `.${StateClassNames.ACTIVE}[data-navigation-item] [data-navigation-link]`,
  );
  private links = this.getElements<HTMLAnchorElement>('[data-navigation-link]');
  private readonly searchToggleButton = this.getElement('[data-search-button]');
  private closeNavTimeout: number | null = null;
  private app: App | null = null;
  private activeMenuItem: number | null = null;
  private scrollbarWidth = getScrollbarWidth();
  private navBar: null | HTMLElement = null;
  private isSearchExpanded: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O29DropdownNavigationTransitionController(this);

    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();
    this.navBar = this.app.getElement('[data-primary-navigation]');

    window.onload = () => {
      this.moveIndicatorToStartingPosition();
    };
  }

  private set scrollEnabled(isEnabled: boolean) {
    if (!this.app) throw new Error('The app component cannot be found');
    this.app.toggleScroll(isEnabled);
  }

  private async onNavigationItemSelect(activeItem: number) {
    this.adjustNavPositioning(this.scrollbarWidth);

    await this.setNavigationOpen(true);
    this.scrollEnabled = false;

    const inactiveButtons = this.navigationMenuButtons.filter(
      (item, itemIndex) => itemIndex !== activeItem,
    );

    this.element.classList.add(StateClassNames.OPEN);
    this.navigationMenuLists[activeItem].classList.add(StateClassNames.OPEN);
    this.navigationMenuButtons[activeItem].classList.add(StateClassNames.OPEN);
    this.navigationMenuButtons[activeItem].setAttribute('aria-expanded', 'true');
    inactiveButtons.forEach((item: HTMLElement) => {
      item.classList.remove(StateClassNames.OPEN);
      item.setAttribute('aria-expanded', 'false');
    });

    if (this.navigationMenuButtons[activeItem].classList.contains('-highlighted')) {
      this.moveIndicatorToStartingPosition();
    } else {
      this.positionIndicator({
        left: this.navigationMenuButtons[activeItem].offsetLeft,
        width: this.navigationMenuButtons[activeItem].offsetWidth,
      });
    }

    const getActiveListItemContent = (activeListItem: HTMLElement) =>
      activeListItem.querySelector('.o-dropdownNavigationList__items') as HTMLElement;

    displayActiveMenuItems(
      this.navigationMenuLists,
      activeItem,
      this.activeMenuItem,
      getActiveListItemContent,
    );

    this.activeMenuItem = activeItem;
  }

  public async closeNavigation() {
    await this.setNavigationOpen(false);

    this.moveIndicatorToStartingPosition();

    this.element.classList.remove(StateClassNames.OPEN);
    if (this.activeMenuItem !== null) {
      this.navigationMenuButtons[this.activeMenuItem]?.classList.remove(StateClassNames.OPEN);
      this.navigationMenuButtons[this.activeMenuItem]?.setAttribute('aria-expanded', 'false');
      this.navigationMenuLists[this.activeMenuItem]?.classList.remove(StateClassNames.OPEN);
      this.hideMenuList(this.activeMenuItem);
    }

    this.activeMenuItem = null;
    this.scrollEnabled = true;
    this.adjustNavPositioning();
  }

  public toggleExpanded(): void {
    const ExpandedValue = !this.isSearchExpanded;

    this.searchToggleButton?.setAttribute('aria-expanded', ExpandedValue.toString());
    this.isSearchExpanded = ExpandedValue;
  }

  private adjustNavPositioning(value?: number) {
    if (this.navBar) {
      this.navBar.style.marginRight = !value ? 'initial' : `${value}px`;
    }
  }

  private clearNavCloseTimeout() {
    this.closeNavTimeout && clearTimeout(this.closeNavTimeout);
    this.closeNavTimeout = null;
  }

  private onFocus = async (menuItemIndex: number) => {
    this.clearNavCloseTimeout();

    menuItemIndex !== this.activeMenuItem && (await this.onNavigationItemSelect(menuItemIndex));
  };

  private onLostFocus = (timeoutMs: number) => {
    this.closeNavTimeout = setTimeout(async () => {
      await this.closeNavigation();
      this.closeNavTimeout = null;
    }, timeoutMs);
  };

  private addFocusListenersForMenuItems = (element: HTMLElement, index: number) => {
    if (element) {
      ['mouseover', 'focusin'].forEach((event) =>
        this.addDisposableEventListener(element, event, () => {
          this.onFocus(index);
        }),
      );

      const currentMenuItemButton = this.navigationMenuButtons[index];
      this.addDisposableEventListener(currentMenuItemButton, 'focus', async () => {
        await this.onFocus(index);
      });
    }
  };

  private addFocusLostListenersForMenuItems = (element: HTMLElement) => {
    if (element) {
      ['mouseleave', 'focusout'].forEach((event) =>
        this.addDisposableEventListener(element, event, (e) => {
          const sideMenuButtons = Array.from(element.querySelectorAll('[data-side-menu-button]'));
          const sideMenus = element.querySelectorAll('[data-side-menu]');
          const sideMenuItems =
            sideMenus.length > 0
              ? Array.from(sideMenus).reduce((sideMenuItems, sideMenu) => {
                  return [...sideMenuItems, ...Array.from(sideMenu.querySelectorAll('a, button'))];
                }, [] as Array<Element>)
              : [];
          const target = e.target as unknown as Element;
          if (!sideMenuButtons.includes(target) && !sideMenuItems.includes(target)) {
            const timeoutDelay = 150;
            this.onLostFocus(timeoutDelay);
          }
        }),
      );
    }
  };

  private addEventListeners(): void {
    this.navigationMenuItems.forEach((menuItem, index) => {
      this.addFocusListenersForMenuItems(menuItem, index);
      this.addFocusLostListenersForMenuItems(menuItem);
    });

    this.links.forEach((link) => {
      this.addDisposableEventListener(link, 'click', () => {
        const { hostname, href, innerText = '' } = link;

        trackEvent({
          event: TrackingEventNames.NAVIGATION_CLICK,
          navigation_type: 'header',
          link_domain: hostname,
          link_url: href,
          click_text: innerText,
        });
      });
    });
  }

  private async setNavigationOpen(isOpen: boolean) {
    if (!this.app) {
      throw new Error('The app component cannot be found');
    }
    await this.app.setIsNavigationOpen(isOpen);
  }

  private positionIndicator({ left, width }: { left: number; width: number }): void {
    this.navigationIndicator!.style.left = `${left}px`;
    this.navigationIndicator!.style.width = `${width}px`;
  }

  private moveIndicatorToStartingPosition() {
    if (this.activeMenuButton || this.activeLink) {
      this.positionIndicator({
        left: this.activeMenuButton
          ? this.activeMenuButton.offsetLeft
          : this.activeLink!.offsetLeft,
        width: this.activeMenuButton
          ? this.activeMenuButton.offsetWidth
          : this.activeLink!.offsetWidth,
      });
    } else {
      this.hideIndicator();
    }
  }

  private hideIndicator() {
    this.navigationIndicator!.style.left = `${this.element.offsetLeft}px`;
    this.navigationIndicator!.style.width = `0px`;
  }

  private hideMenuList(itemIndex: number): void {
    if (this.navigationMenuLists === null) {
      throw new Error('The navigation lists are empty');
    }

    TweenMax.set(this.navigationMenuLists[itemIndex], {
      display: 'none',
      autoAlpha: 0,
    });
  }

  public dispose(): void {
    this.clearNavCloseTimeout();
  }
}
