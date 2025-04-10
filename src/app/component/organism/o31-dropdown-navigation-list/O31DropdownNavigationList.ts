import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { TweenMax } from 'gsap';

import { StateClassNames } from '../../../data/enum/StateClassNames';
import { displayActiveMenuItems } from '../o29-dropdown-navigation/diplayActiveMenuItems';
import O31DropdownNavigationListTransitionController from './O31DropdownNavigationListTransitionController';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

export default class O31DropdownNavigationList extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o31-dropdown-navigation-list';
  public readonly transitionController: O31DropdownNavigationListTransitionController;
  private readonly menuItems: ReadonlyArray<HTMLAnchorElement> = this.getElements(
    '[data-navigation-menu-item]',
  );
  private readonly sideMenus: ReadonlyArray<HTMLDivElement> = this.getElements('[data-side-menu]');
  private lastActiveSideMenuItem: number | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O31DropdownNavigationListTransitionController(this);

    this.menuItems.forEach(this.addFocusListenersMenuItems);
    this.addMouseleaveListenerToNavList();
    this.menuItems.forEach(this.addBlurListenersToMenuItems);
    this.trackClickEvent();
  }

  private addFocusListenersMenuItems = (element: HTMLElement, index: number) => {
    ['focus', 'mouseenter'].forEach((event) =>
      this.addDisposableEventListener(element, event, () => {
        this.setAriaExpandedValue(element, true);

        if (this.isSideMenuButton(element)) {
          const activeSideMenuIndex = this.getActiveSideMenuIndex(index);
          activeSideMenuIndex !== this.lastActiveSideMenuItem && this.displaySideMenu(index);
        } else {
          this.hideLastActiveSideMenu();
        }
      }),
    );
  };

  private addBlurListenersToMenuItems = (element: HTMLElement, index: number) => {
    this.addDisposableEventListener(element, 'blur', () => {
      const assignedSideMenu = this.sideMenus.find(
        (sideMenu) => sideMenu.dataset.sideMenu === `${index}`,
      );

      if (assignedSideMenu) {
        const linkElements = assignedSideMenu.querySelectorAll(
          'a, button',
        ) as NodeListOf<HTMLElement>;

        linkElements[0].focus();
        this.addDisposableEventListener(linkElements[linkElements.length - 1], 'blur', () => {
          if (this.menuItems[index + 1]) {
            this.menuItems[index + 1].focus();
          }
        });
      }

      const currentSideMenuIndex = this.getElement(`.${StateClassNames.ACTIVE}[data-side-menu]`)
        ?.dataset.sideMenu;

      if (Number(currentSideMenuIndex) != index) {
        this.setAriaExpandedValue(element, false);
      }
    });
  };

  private addMouseleaveListenerToNavList = () => {
    this.addDisposableEventListener(this.element, 'mouseleave', () => {
      this.hideLastActiveSideMenu();
    });
  };

  /**
   * Notify Assistive technology about default/expanded state of passed panel navigation item.
   * This function doesn't do anything if passed element can't be expandable.
   *
   * @param element - panel navigation item(Button or Link)
   * @param shouldExpand - should panel navigation item be expanded
   */
  private setAriaExpandedValue(element: HTMLElement, shouldExpand: boolean) {
    if (this.isSideMenuButton(element)) {
      element.setAttribute('aria-expanded', String(shouldExpand));
    }

    if (shouldExpand) {
      this.menuItems.forEach((item) => {
        if (this.isSideMenuButton(item) && item !== element) {
          item.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  private getActiveSideMenuIndex(activeMenuItemIndex: number) {
    const activeSideMenuIndex = this.sideMenus.findIndex(
      (sideMenu) => sideMenu.dataset.sideMenu === `${activeMenuItemIndex}`,
    );

    return activeSideMenuIndex;
  }

  private trackClickEvent() {
    this.menuItems.forEach((menuItem) => {
      this.addDisposableEventListener(menuItem, 'click', () => {
        trackEvent({
          event: TrackingEventNames.NAVIGATION_CLICK,
          navigation_type: 'header',
          link_domain: menuItem.hostname || '',
          link_url: menuItem.href || '',
          click_text: menuItem.innerText || '',
        });
      });
    });
  }

  private displaySideMenu(activeMenuItemIndex: number) {
    if (this.lastActiveSideMenuItem !== null) {
      this.hideLastActiveSideMenu({ duration: 0 });
    }

    const activeSideMenuIndex = this.getActiveSideMenuIndex(activeMenuItemIndex);

    const getActiveSideMenuContent = (activeMenu: HTMLElement) =>
      activeMenu.querySelector('[data-dropdown-navigation-list]') as HTMLElement;

    displayActiveMenuItems(
      this.sideMenus,
      activeSideMenuIndex,
      this.lastActiveSideMenuItem,
      getActiveSideMenuContent,
      0.3,
    );

    this.sideMenus[activeSideMenuIndex].classList.add(StateClassNames.ACTIVE);
    this.lastActiveSideMenuItem = activeSideMenuIndex;
  }

  private hideMenu(sideMenuItem: HTMLElement, duration: number) {
    const hideSideMenuTweenConfig: gsap.TweenConfig = {
      autoAlpha: 0,
      display: 'none',
    };

    TweenMax.to(sideMenuItem, duration, hideSideMenuTweenConfig);
    sideMenuItem.classList.remove(StateClassNames.ACTIVE);
  }

  private hideLastActiveSideMenu(options?: { duration: number }) {
    if (this.lastActiveSideMenuItem !== null) {
      const sideMenuItem = this.sideMenus[this.lastActiveSideMenuItem];
      const duration = options?.duration;
      const defaultDuration = 0.4;
      this.hideMenu(sideMenuItem, duration !== undefined ? duration : defaultDuration);
    }
    this.lastActiveSideMenuItem = null;
  }

  private isSideMenuButton(element: HTMLElement): boolean {
    return 'sideMenuButton' in element.dataset;
  }
}
