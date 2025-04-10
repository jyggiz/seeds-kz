import AbstractComponent from 'app/component/AbstractComponent';
import { Collapsible } from '../../../util/collapsible/Collapsible';
import CollapsibleEvent from '../../../util/collapsible/CollapsibleEvent';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { isRtl } from '../../../util/rtlUtils';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import deviceStateTracker from 'app/util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

export default class O36SecondaryNavigation extends AbstractComponent {
  public static readonly displayName: string = 'o36-secondary-navigation';

  public readonly collapsible: Collapsible;
  private readonly sectorToggle = this.getElement('[data-sector-toggle]');
  private readonly navigationCollapsible = this.getElement('[data-navigation-collapsible]');
  private readonly rootHeader = this.element.parentElement;
  private readonly secondLevelMenuList = this.getElements('[data-secondary-navigation-item]');
  private readonly activeItem = this.getElement('[data-secondary-navigation-item].-isActive');
  private readonly links = this.getElements<HTMLAnchorElement>('[data-dropdown-link]');
  private isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.LARGE;
  private lastActiveItemIndex: number = this.activeItem
    ? this.secondLevelMenuList.indexOf(this.activeItem)
    : -1;

  constructor(element: HTMLElement) {
    super(element);

    if (!this.navigationCollapsible) {
      throw new Error('The content element does not exist');
    }

    this.collapsible = new Collapsible(this.navigationCollapsible);
    this.collapsible.collapse(0);

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.sectorToggle &&
      this.addDisposableEventListener(
        this.sectorToggle,
        'click',
        this.handleToggleButtonClick.bind(this),
      );

    this.addDisposableEventListener(
      this.collapsible,
      CollapsibleEvent.EXPAND,
      this.handleCollapsibleExpand.bind(this),
    );

    this.addDisposableEventListener(
      this.collapsible,
      CollapsibleEvent.COLLAPSE,
      this.handleCollapsibleCollapse.bind(this),
    );

    this.secondLevelMenuList.forEach((item, index) => {
      this.addDisposableEventListener(item, 'click', () => this.onNavigationItemClick(index));
    });

    this.links.forEach((link) => {
      const { hostname, href, innerText = '' } = link;

      this.addDisposableEventListener(link, 'click', () => {
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

  private onNavigationItemClick(index: number): void {
    if (index != this.lastActiveItemIndex) {
      this.secondLevelMenuList[this.lastActiveItemIndex]?.classList.remove(StateClassNames.OPEN);
    }

    const activeMenuItem = this.secondLevelMenuList[index];
    const activeMenuItemButton = activeMenuItem.querySelector('.o-secondaryNavigation__itemButton');

    activeMenuItemButton && activeMenuItem.classList.toggle(StateClassNames.OPEN);

    const isDropdownOpen = activeMenuItem.classList.contains(StateClassNames.OPEN);
    activeMenuItemButton?.setAttribute('aria-expanded', `${isDropdownOpen}`);

    if (!this.isMobile) {
      this.setNavigationVisibilityState(isDropdownOpen);
    }

    this.setDropdownPositionStyle(activeMenuItem);
    this.lastActiveItemIndex = index;
  }

  private setDropdownPositionStyle(activeMenuItem: HTMLElement) {
    const dropdown = activeMenuItem.querySelector(
      '.o-secondaryNavigation__childWrapper',
    ) as HTMLElement | null;
    const { right, left } = activeMenuItem.getBoundingClientRect();

    if (dropdown) {
      isRtl()
        ? (dropdown.style.left = `${left}px`)
        : (dropdown.style.right = `${window.innerWidth - right}px`);
    }
  }

  private handleCollapsibleCollapse(event: CollapsibleEvent): void {
    this.element.classList.remove(StateClassNames.EXPANDED);
    this.dispatcher.dispatchEvent(event);
  }

  private handleCollapsibleExpand(event: CollapsibleEvent): void {
    this.element.classList.add(StateClassNames.EXPANDED);
    this.dispatcher.dispatchEvent(event);
  }

  private handleToggleButtonClick(): void {
    if (this.collapsible) {
      this.collapsible.toggle();
      this.setNavigationVisibilityState(!this.collapsible.isCollapsed);
    }
  }

  private setNavigationVisibilityState(isOpen: boolean) {
    if (isOpen) {
      this.rootHeader?.style.setProperty('--navigation-background', 'var(--color-black-95a)');
      disableBodyScroll(this.element);
    } else {
      this.rootHeader?.style.removeProperty('--navigation-background');
      enableBodyScroll(this.element);
    }
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.MEDIUM;
  }

  public closeOpenedList(): void {
    const activeMenuItem = this.secondLevelMenuList[this.lastActiveItemIndex];
    const activeMenuItemButton = activeMenuItem?.querySelector(
      '.o-secondaryNavigation__itemButton',
    );

    activeMenuItemButton && activeMenuItem?.classList.remove(StateClassNames.OPEN);
    activeMenuItemButton?.setAttribute('aria-expanded', 'false');

    if (!this.isMobile) {
      this.setNavigationVisibilityState(false);
    }
  }
}
