import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { TweenMax } from 'gsap';
import O27PanelNavigationTransitionController from './O27PanelNavigationTransitionController';
import { getAppComponent } from '../../../util/getElementComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import eases from '../../../animation/eases';
import App from '../../layout/app/App';
import { isRtl } from 'app/util/rtlUtils';
import M47HamburgerMenu from '../../molecule/m47-hamburger-menu/M47HamburgerMenu';
import { M47HamburgerMenuEvent } from '../../molecule/m47-hamburger-menu/M47HamburgerMenu.utils';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';

export default class O27PanelNavigation extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o27-panel-navigation';
  public readonly transitionController: O27PanelNavigationTransitionController;

  public readonly navigationOverlay = this.getElement('[data-panel-overlay]');
  public readonly panelMenuButtons = this.getElements('[data-panel-menu-button]');
  private readonly panelNavigationMenus = this.getElements('[data-panel-menu]');
  private readonly panelNavigationBackButtons = this.getElements('[data-panel-back-button]');
  public readonly navigationWrapper = this.getElement('[data-panel-wrapper]');
  private readonly panelLinks = this.getElements<HTMLAnchorElement>('[data-panel-link]');
  private readonly dataPanelMenuLink =
    this.getElements<HTMLAnchorElement>('[data-panel-menu-link]');
  public readonly hamburgerMenu = this.getComponent<M47HamburgerMenu>(M47HamburgerMenu.displayName);

  private isNavigationOpen: boolean = false;
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
    //must be added before setElements call
    this.element.classList.add(StateClassNames.IS_INITIALISED);

    this.transitionController = new O27PanelNavigationTransitionController(this);

    this.setElements();
    this.addEventListeners();
  }

  private onPanelMenuButtonClick(index: number) {
    TweenMax.to(this.panelNavigationMenus[index], 0.6, {
      xPercent: 0,
      ease: eases.VinnieInOut,
    });
  }

  private onBackButtonClick(index: number) {
    TweenMax.to(this.panelNavigationMenus[index], 0.4, {
      xPercent: isRtl() ? -100 : 100,
      ease: eases.VinnieInOut,
    });
  }

  public async adopted() {
    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.panelMenuButtons.forEach((navigationItem, index) => {
      navigationItem &&
        this.addDisposableEventListener(navigationItem, 'click', () =>
          this.onPanelMenuButtonClick(index),
        );
    });

    this.panelNavigationBackButtons.forEach((backButton, index) => {
      backButton &&
        this.addDisposableEventListener(backButton, 'click', () => this.onBackButtonClick(index));
    });

    this.hamburgerMenu &&
      this.addDisposableEventListener(
        this.hamburgerMenu.dispatcher,
        M47HamburgerMenuEvent.types.TOGGLE_MENU,
        this.toggleNavigation.bind(this),
      );

    this.dataPanelMenuLink.forEach((panelMenuLink) => {
      this.addDisposableEventListener(panelMenuLink, 'click', () => {
        this.handleLinkClick(panelMenuLink);
      });
    });

    this.panelLinks.forEach((panelLink) => {
      this.addDisposableEventListener(panelLink, 'click', () => {
        this.handleLinkClick(panelLink);
      });
    });
  }

  private handleLinkClick(panelLink: HTMLAnchorElement): void {
    const { hostname, href, innerText = '' } = panelLink;

    trackEvent({
      event: TrackingEventNames.NAVIGATION_CLICK,
      navigation_type: 'header',
      link_domain: hostname,
      link_url: href,
      click_text: innerText,
    });
  }

  private set scrollEnabled(isEnabled: boolean) {
    if (!this.app) {
      throw new Error('The app component cannot be found');
    }

    this.app.toggleScroll(isEnabled);
  }

  private setElements(): void {
    TweenMax.set([this.navigationWrapper, this.panelNavigationMenus], {
      xPercent: isRtl() ? -100 : 100,
    });
  }

  public async toggleNavigation() {
    this.scrollEnabled = this.isNavigationOpen;
    this.element.classList.toggle(StateClassNames.OPEN, !this.isNavigationOpen);
    this.isNavigationOpen ? this.transitionOut(true) : this.transitionIn(true);
    if (this.app) {
      await this.app.setIsNavigationOpen(!this.isNavigationOpen);
    }
    this.isNavigationOpen = !this.isNavigationOpen;
  }

  public closeNavigation(): void {
    this.hamburgerMenu?.toggleMenu();
  }

  public transitionIn(forceTransition?: boolean | undefined) {
    return super.transitionIn(forceTransition);
  }

  public async transitionOut(forceTransition?: boolean | undefined) {
    const transition = await super.transitionOut(forceTransition);

    return transition;
  }
}
