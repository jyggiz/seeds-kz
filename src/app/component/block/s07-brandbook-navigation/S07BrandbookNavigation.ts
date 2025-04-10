import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import S07BrandbookNavigationTransitionController from './S07BrandbookNavigationTransitionController';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { getAppComponent } from '../../../util/getElementComponent';
import App from '../../layout/app/App';
import mq from '../../../data/shared-variable/media-queries.json';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import debounce from 'lodash-es/debounce';
import { updateClassForItems } from 'app/util/stateClassNamesToggle';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { updateElement } from 'muban-core';
import M47HamburgerMenu from '../../molecule/m47-hamburger-menu/M47HamburgerMenu';
import { M47HamburgerMenuEvent } from '../../molecule/m47-hamburger-menu/M47HamburgerMenu.utils';

export default class S07BrandbookNavigation extends AbstractTransitionComponent {
  public static readonly displayName: string = 's07-brandbook-navigation';
  public readonly transitionController: S07BrandbookNavigationTransitionController;
  public isNavigationOpen: boolean = false;

  private isLargeViewport: boolean = false;
  private activeSecondaryListItemIndex: number | undefined;
  private currentOffsetY: number = 0;
  private isScrolledEnoughToHideNav: number = 200;
  private isScrolledEnoughToShowHamburger: number = 120;
  private app: App | null = null;
  private currentDeviceState: IDeviceStateData['state'];

  private navigationContainer: HTMLElement | null = this.getElement('[data-navigation-container]');
  private hamburgerContainer: HTMLElement | null = this.element.querySelector(
    '[data-navigation-hamburger]',
  );
  private closeButton: HTMLElement | null = this.getElement('[data-navigation-close-button]');
  private navigationItems: HTMLElement | null = this.getElement('[data-navigation-items]');
  private navigationOverlay: HTMLElement | null = this.getElement('[data-navigation-overlay]');
  private navigationListItems: ReadonlyArray<HTMLElement> =
    this.getElements('[data-navigation-item]');
  private navigationPrimaryListItems: ReadonlyArray<HTMLElement> | null = this.getElements(
    '[data-navigation-primary-list]',
  );
  private navigationPrimaryListItemsAction: ReadonlyArray<HTMLElement> | null = this.getElements(
    '[data-navigation-primary-action]',
  );
  private navigationSecondaryListItems: ReadonlyArray<HTMLElement> = this.getElements(
    '[data-navigation-secondary-list]',
  );
  private navigationSecondaryListItemAction: ReadonlyArray<HTMLElement> = this.getElements(
    '[data-navigation-secondary-action]',
  );
  private hamburgerMenuComponent = this.getComponent<M47HamburgerMenu>(
    M47HamburgerMenu.displayName,
  );
  private elementOuterHTML: string = this.element.outerHTML;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new S07BrandbookNavigationTransitionController(this);
    this.addNavigationEventListeners();
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.currentDeviceState = deviceStateTracker.currentDeviceState.state;

    this.isLargeViewport = deviceStateTracker.currentDeviceState.state >= mq.deviceState.MEDIUM;
  }

  public async adopted(): Promise<void> {
    this.app = await getAppComponent();

    this.addDisposableEventListener(
      window,
      'scroll',
      debounce(this.onScrollPositionChange.bind(this), 5),
    );

    this.activeSecondaryListItemIndex = this.navigationSecondaryListItems.findIndex((listItem) =>
      listItem.classList.contains(StateClassNames.ACTIVE),
    );
    this.renderNavigation();
  }

  private addNavigationEventListeners() {
    if (this.hamburgerMenuComponent === null) {
      throw new Error("hamburgerMenuComponent doesn't exist");
    }

    this.addDisposableEventListener(
      this.hamburgerMenuComponent.dispatcher,
      M47HamburgerMenuEvent.types.TOGGLE_MENU,
      this.toggleNavigationOverlay.bind(this),
    );

    if (this.navigationPrimaryListItemsAction) {
      this.navigationPrimaryListItemsAction.forEach(
        (primaryListItem: HTMLElement, index: number) => {
          if (primaryListItem?.hasAttribute('href')) return;
          primaryListItem.addEventListener('click', () => {
            this.toggleNavigationPrimaryListItem(primaryListItem);
          });
        },
      );
    }

    if (this.navigationSecondaryListItems) {
      this.navigationSecondaryListItemAction.forEach((secondaryListItem: HTMLElement) => {
        secondaryListItem.addEventListener('click', this.onSecondaryListItemClick.bind(this));
      });
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        if (this.closeButton) this.toggleNavigationOverlay();
      });
    }
  }

  private handleOpenSecondaryState() {
    this.navigationSecondaryListItems.forEach((listItem) => {
      listItem.classList.remove(StateClassNames.ACTIVE);
      listItem.classList.remove(StateClassNames.OPEN);
    });

    if (this.activeSecondaryListItemIndex === -1) {
      this.navigationSecondaryListItems[0].classList.toggle(StateClassNames.OPEN);
    } else {
      if (this.activeSecondaryListItemIndex === 0 || this.activeSecondaryListItemIndex) {
        this.navigationSecondaryListItems[this.activeSecondaryListItemIndex].classList.toggle(
          StateClassNames.OPEN,
        );
        this.navigationSecondaryListItems[this.activeSecondaryListItemIndex].classList.toggle(
          StateClassNames.ACTIVE,
        );
      }
    }
  }

  private onSecondaryListItemClick(event: MouseEvent): void {
    const currentSecondaryNavigationItem =
      (event.currentTarget as HTMLElement)?.parentElement || null;

    if (!this.navigationSecondaryListItems || !currentSecondaryNavigationItem) return;

    const addToOne = currentSecondaryNavigationItem.classList.contains(StateClassNames.OPEN)
      ? null
      : currentSecondaryNavigationItem;

    updateClassForItems({
      removeFrom: this.navigationSecondaryListItems,
      addToOne,
      className: StateClassNames.ACTIVE,
    });

    updateClassForItems({
      removeFrom: this.navigationSecondaryListItems,
      addToOne,
      className: StateClassNames.OPEN,
    });
  }

  private toggleNavigationOverlay() {
    this.handleOpenSecondaryState();
    this.isNavigationOpen = !this.isNavigationOpen;

    if (this.app) {
      this.app.toggleScroll(!this.isNavigationOpen);
    }

    if (this.app) {
      this.app.setScrollToTopButtonVisibility(this.isNavigationOpen);
    }

    if (!this.element.classList.contains(StateClassNames.SCROLLED)) {
      this.element.classList.toggle(StateClassNames.OPEN);
      if (!this.isLargeViewport) {
        if (this.navigationItems) {
          TweenMax.to(this.navigationItems, 0.4, {
            autoAlpha: this.isNavigationOpen ? 1 : 0,
            display: this.isNavigationOpen ? 'block' : 'none',
            ease: eases.VinnieInOut,
          });
        }
      }
    } else {
      const mainNavigationOffset = this.navigationContainer?.offsetHeight;
      if (mainNavigationOffset) {
        this.navigationContainer &&
          this.isLargeViewport &&
          TweenMax.to(this.navigationContainer, 0.4, {
            y: this.isNavigationOpen ? 0 : -mainNavigationOffset,
            ease: eases.VinnieInOut,
          });

        if (!this.isLargeViewport) {
          if (this.navigationItems) {
            TweenMax.to(this.navigationItems, 0.4, {
              autoAlpha: this.isNavigationOpen ? 1 : 0,
              display: this.isNavigationOpen ? 'block' : 'none',
              ease: eases.VinnieInOut,
            });
          }
        }
      }
    }

    if (this.navigationPrimaryListItems) {
      this.navigationPrimaryListItems.forEach((primaryListItem: HTMLElement) => {
        primaryListItem.classList.toggle(StateClassNames.OPEN);
      });
    }

    if (this.navigationOverlay) {
      TweenMax.to(this.navigationOverlay, 0.4, {
        autoAlpha: this.isNavigationOpen ? 1 : 0,
        display: this.isNavigationOpen ? 'block' : 'none',
        ease: eases.VinnieInOut,
      });
    }
  }

  private toggleNavigationPrimaryListItem(primaryListItem: HTMLElement) {
    if (!this.isLargeViewport) {
      const primaryListItemParentElement = primaryListItem.parentElement;
      primaryListItemParentElement?.classList.toggle(StateClassNames.OPEN);
    } else {
      if (this.element.classList.contains(StateClassNames.SCROLLED)) {
        if (this.hamburgerContainer) {
          const menuButton = this.getElement('[ data-hamburger-menu]', this.hamburgerContainer);
          menuButton?.click();
        }
      } else {
        this.toggleNavigationOverlay();
      }
    }
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    const elementFirstChild = this.element.firstChild;
    elementFirstChild && elementFirstChild.remove();
    if (this.app) {
      this.app.toggleScroll(true);
    }
    updateElement(this.element, this.elementOuterHTML);
  }

  private renderNavigation() {
    if (this.isScrolledEnoughToHideNav <= scrollY) {
      this.element.classList.add(StateClassNames.SCROLLED);
    }
  }

  private onScrollPositionChange(): void {
    if (this.navigationContainer) {
      const mainNavigationOffset = this.navigationContainer.offsetHeight;
      if (scrollY > this.currentOffsetY && scrollY >= this.isScrolledEnoughToHideNav) {
        if (!this.isNavigationOpen) {
          TweenMax.to(this.navigationContainer, 0.4, {
            y: -mainNavigationOffset,
            ease: eases.VinnieInOut,
          });
        }
      }
      if (this.isLargeViewport) {
        if (scrollY <= this.currentOffsetY && scrollY <= this.isScrolledEnoughToHideNav) {
          TweenMax.to(this.navigationContainer, 0.4, {
            y: 0,
            ease: eases.VinnieInOut,
          });
        }
      } else if (!this.isLargeViewport) {
        if (scrollY < this.currentOffsetY) {
          TweenMax.to(this.navigationContainer, 0.4, {
            y: 0,
            ease: eases.VinnieInOut,
          });
        }
      }

      if (scrollY > this.isScrolledEnoughToHideNav) {
        !this.element.classList.contains(StateClassNames.SCROLLED) &&
          this.element.classList.add(StateClassNames.SCROLLED);
      } else {
        this.element.classList.contains(StateClassNames.SCROLLED) &&
          this.element.classList.remove(StateClassNames.SCROLLED);
      }

      if (this.hamburgerContainer) {
        if (scrollY >= this.isScrolledEnoughToHideNav && this.isLargeViewport) {
          TweenMax.to(this.hamburgerContainer, 0.4, {
            autoAlpha: 1,
            display: 'block',
          });
        } else if (
          scrollY > this.isScrolledEnoughToHideNav &&
          scrollY > this.currentOffsetY &&
          !this.isLargeViewport
        ) {
          TweenMax.to(this.hamburgerContainer, 0, {
            y: -mainNavigationOffset,
            ease: eases.VinnieInOut,
          });
        } else if (!this.isLargeViewport && scrollY < this.currentOffsetY) {
          TweenMax.to(this.hamburgerContainer, 0.4, {
            y: 0,
            ease: eases.VinnieInOut,
          });
        } else if (scrollY <= this.isScrolledEnoughToHideNav && this.isLargeViewport) {
          TweenMax.set(this.hamburgerContainer, {
            autoAlpha: 0,
            display: 'none',
          });
        }
      }

      if (scrollY >= document.body.clientHeight) scrollY = document.body.clientHeight;

      TweenMax.delayedCall(0.15, () => {
        this.currentOffsetY = scrollY;
      });
    }
  }

  public dispose() {
    super.dispose();
    if (!this.app) return;
  }
}
