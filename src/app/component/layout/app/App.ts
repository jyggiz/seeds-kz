import { TweenMax } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import debounce from 'lodash-es/debounce';
import { CoreComponent } from 'muban-core';
import { ComponentModule } from 'muban-core/lib/utils/componentStore';
import getComponentForElement from 'muban-core/lib/utils/getComponentForElement';
import {
  initialisePageTransitions,
  PageTransitionController,
} from 'muban-page-transition-controller';
import { IMubanTransitionMixin, MubanTransitionVariable } from 'muban-transition-component';
import { ScrollTrackerComponentManager } from 'scroll-tracker-component-manager';
import { addEventListener } from 'seng-disposable-event-listener';
import { DisposableManager } from 'seng-disposable-manager';
import eases from '../../../animation/eases';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { isEditor } from '../../../util/aemEditorUtils';
import setViewportCustomProperties from '../../../util/setViewportCustomProperties';
import sleep from '../../../util/sleep';
import { lazyLoadComponent } from '../../../util/lazyLoadComponent';
import type S01Navigation from '../../block/s01-navigation/S01Navigation';
import S05AnchorLinkButton from '../../block/s05-anchor-link-button/S05AnchorLinkButton';
import S08ScrollToTop from '../../block/s08-scroll-to-top/S08ScrollToTop';
import type S09Overlay from '../../block/s09-overlay/S09Overlay.lazyOverlay';
import M10ScrollButton from '../../molecule/m10-scroll-button/M10ScrollButton';
import M33Cursor from '../../molecule/m33-cursor/M33Cursor';
import type O47DownloadDrawer from '../../organism/o47-download-drawer/O47DownloadDrawer.lazyManual';
import O48LoadingSpinner from '../../organism/o48-loading-spinner/O48LoadingSpinner';
import O54PageTransition from '../../organism/o54-page-transition/O54PageTransition';
import { O25PopupMessageContentProps } from 'app/component/organism/o25-popup-message-content/O25PopupMessageContent.types';
import { lazyLoadComponents } from 'app/lazyLoadComponents';
import awaitElementComponent from 'app/util/getElementComponent';
import {
  NAV_IS_READY,
  NavIsReadyEvent,
  NavTemplateNames,
  navTemplates,
} from 'app/component/organism/o97-navigation-placeholder/O97NavigationPlaceholder';
import promisifyTimeline from 'app/util/promisifyTimeline';

type NavComponents = {
  [navTemplates.S01Template]: S01Navigation;
};

const lazyOverlayComponentsContext = require.context('../../', true, /\.lazyOverlay\.ts$/, 'lazy');

const lazyLoadO47 = () => import('../../organism/o47-download-drawer/O47DownloadDrawer.lazyManual');

export default class App extends CoreComponent {
  static displayName: string = 'app-root';

  public pageTransitionController: PageTransitionController | null = null;

  public scrollTrackerComponentManager: ScrollTrackerComponentManager<IMubanTransitionMixin>;

  public overlayInstance: S09Overlay | null = null;
  private overlayElement: HTMLElement | null = this.getElement('[data-component="s09-overlay"]');
  private disposables: DisposableManager = new DisposableManager();
  private navDisposables: DisposableManager = new DisposableManager();
  private navigation: NavComponents[NavTemplateNames] | null = null;
  private scrollButton: M10ScrollButton | null = null;
  private downloadDrawer: O47DownloadDrawer | null = null;
  private anchorLinkButton: S05AnchorLinkButton | null = null;
  private scrollToTopButton: S08ScrollToTop | null = null;
  private cursor: M33Cursor | null = null;
  private loadingSpinner: O48LoadingSpinner | null = null;
  private scrollTrackingEnabled = new Map<HTMLElement, true>();
  private scrollPosition = {
    X: 0,
    Y: 0,
  };
  private scrollLockTimeout: number | null = null;

  private readonly enablePageTransitions: boolean = Boolean(
    this.element.dataset.enablePageTransitions,
  );
  public isScrolling = false;

  constructor(element: HTMLElement) {
    super(element);

    // Promote data-<theme> attribute to HTML element
    if (process.env.NODE_ENV === 'development' && this.theme) {
      (document.firstElementChild as HTMLHtmlElement).dataset.theme = this.theme ?? 'neom';
    }

    this.scrollTrackerComponentManager = new ScrollTrackerComponentManager<IMubanTransitionMixin>({
      setDebugLabel: process.env.NODE_ENV === false,
      debugBorderColor: 'red',
      container: window,
      inViewProgressEnabled: true,
      resizeDebounce: 100,
    });

    this.toggleScroll(true);

    ScrollToPlugin;
  }

  getComponentInAppContext<T extends typeof CoreComponent>(component: T): InstanceType<T> | null {
    const element = this.getElement(
      `[data-component="${(component as unknown as ComponentModule).displayName}"]`,
    );

    if (element) {
      return getComponentForElement<InstanceType<T>>(element);
    }

    return null;
  }

  /**
   * @public
   * @method allComponentsConstructed
   */
  public async adopted(): Promise<void> {
    this.element.classList.add(StateClassNames.READY);

    setViewportCustomProperties();

    this.disposables.add(
      addEventListener(
        window,
        'resize',
        debounce(() => setViewportCustomProperties(), 50),
      ),
    );

    this.loadingSpinner = this.getComponentInAppContext(O48LoadingSpinner);
    this.anchorLinkButton = this.getComponentInAppContext(S05AnchorLinkButton);
    this.scrollToTopButton = this.getComponentInAppContext(S08ScrollToTop);
    this.scrollButton = this.getComponentInAppContext(M10ScrollButton);
    this.cursor = this.getComponentInAppContext(M33Cursor);
    this.getNavigationInstance();

    if (!isEditor() && this.enablePageTransitions) {
      await sleep(150);
      const transitionElement = this.getElement(
        `[data-component="${O54PageTransition.displayName}"]`,
      );
      if (!transitionElement) return;

      const transitionComponent = await awaitElementComponent<O54PageTransition>(transitionElement);
      this.pageTransitionController = await initialisePageTransitions({
        linkElements: this.linkElements,
        onBeforeNavigateOut: async () => transitionComponent.transitionOut(),
        onBeforeNavigateIn: async () => transitionComponent.transitionIn(),
      });
    }

    this.addComponentsToScrollTracker();

    setTimeout(() => this.scrollTrackerComponentManager.handleResize(), 2000);
  }

  public addComponentsToScrollTracker(): void {
    this.getElements(`[${MubanTransitionVariable.scrollComponentAttribute}]`).forEach(
      (element: HTMLElement) => {
        const componentId = element.getAttribute('data-component');

        if (!componentId) {
          // tslint:disable-next-line:no-console
          console.warn('Id for element missing', element);
          // return so that one missing component does not break the scroll tracking
          // for entire page
          return;
        }
        // only add component to scroll tracker if it hasn't
        // been already added
        if (!this.scrollTrackingEnabled.has(element)) {
          const component = getComponentForElement(element);

          if (!component) {
            // tslint:disable-next-line:no-console
            // Uncommenting the console.warn will warn about missing components. These components
            // are the components that are lazy loaded, and are added to scroll tracker
            // after their registration and instantiation.
            // console.warn('Component for element missing', element);
            // return so that one missing component does not break the scroll tracking
            // for entire page
            return;
          }

          this.scrollTrackerComponentManager.addComponentToScrollTracker(
            <IMubanTransitionMixin>component,
          );

          this.scrollTrackingEnabled.set(element, true);
        }
      },
    );
  }

  public isLinkInternal(link: string): boolean {
    const url = new URL(link);
    if (url.pathname === location.pathname) return false;
    return url.hostname === location.hostname;
  }

  public get linkElements(): ReadonlyArray<HTMLAnchorElement> {
    return [...document.querySelectorAll('a')].filter((link) => {
      if (!link.href) return;
      if (this.isLinkInternal(link.href)) return link;
    });
  }

  public async setElementHidden(isHidden: boolean) {
    const nav = await this.getNavigationInstance();
    if (nav) {
      nav.elementHidden = isHidden;
    }
    if (this.scrollButton) {
      this.scrollButton.elementHidden = isHidden;
    }
  }

  public toggleScroll(isEnabled: boolean) {
    document
      .querySelectorAll('html, body')
      .forEach((element) =>
        element.classList[isEnabled ? 'remove' : 'add'](StateClassNames.SCROLL_DISABLED),
      );

    this.toggleScrollIos(isEnabled);
  }

  private storeScrollPosition() {
    this.scrollPosition.Y = window.scrollY;
    this.scrollPosition.X = window.scrollX;
  }

  private scrollLock = () => {
    const { X, Y } = this.scrollPosition;
    // timeout is required, otherwise ios will ignore scrollTo
    this.scrollLockTimeout = setTimeout(() => window.scrollTo(X, Y), 200);
  };

  private toggleScrollIos(isEnabled: boolean) {
    if (isEnabled) {
      window.removeEventListener('touchmove', this.scrollLock, {
        passive: false,
      });
    } else {
      this.storeScrollPosition();
      window.addEventListener('touchmove', this.scrollLock, {
        passive: false,
      });
    }
  }

  public transformCursor(transform: boolean, icon?: string, variant?: string): void {
    if (this.cursor) {
      transform ? this.cursor.transformCursor(icon, variant) : this.cursor.resetCursor();
    }
  }

  public async setIsNavigationOpen(isOpen: boolean) {
    const nav = await this.getNavigationInstance();
    if (nav) {
      nav.navigationOpen = isOpen;
    }

    if (this.anchorLinkButton) {
      isOpen
        ? this.anchorLinkButton.setAnchorLinkVisibility(false)
        : this.anchorLinkButton.updateAnchorLinkVisibility();
    }

    this.setScrollToTopButtonVisibility(isOpen);
  }

  public setScrollToTopButtonVisibility(isOpen: boolean) {
    if (this.scrollToTopButton) {
      isOpen
        ? this.scrollToTopButton.setScrollToTopButtonVisibility(false)
        : this.scrollToTopButton.updateScrollToTopButtonVisibility();
    }
  }

  public scrollToTop() {
    if (this.scrollToTopButton)
      TweenMax.to(window, 0.6, {
        scrollTo: {
          y: 0,
        },
        ease: eases.VinnieInOut,
      });
  }

  public async setLoadingState(isLoading: boolean) {
    if (!this.loadingSpinner) return;
    if (isLoading) {
      this.toggleScroll(false);
      await this.loadingSpinner.transitionIn();
    } else {
      this.toggleScroll(true);
      await this.loadingSpinner.transitionOut();
    }
  }

  public clearDownloadDrawer(): void {
    if (this.downloadDrawer) this.downloadDrawer.clearDownloadDrawer();
  }

  public async sendDownloadData(
    content: string,
    pushToArray: boolean,
    popupCopy?: O25PopupMessageContentProps,
  ) {
    try {
      const o47Instances = await lazyLoadComponent(lazyLoadO47);
      this.downloadDrawer = o47Instances[0] as O47DownloadDrawer;
      if (this.downloadDrawer) {
        this.downloadDrawer.handleData(content, pushToArray, popupCopy);
      }
    } catch (err) {
      console.log(err);
    }
  }

  public updateScrollTrackerPoints(): void {
    this.scrollTrackerComponentManager.handleResize();
  }

  public get theme(): string | null {
    return this.element.dataset.theme ?? null;
  }

  public get overlay(): Promise<S09Overlay> {
    return (async () => {
      if (this.overlayInstance) {
        return this.overlayInstance;
      } else {
        if (!this.overlayElement) {
          throw new Error('could not get overlay element');
        }
        await lazyLoadComponents(this.overlayElement, lazyOverlayComponentsContext);
        this.overlayInstance = getComponentForElement<S09Overlay>(this.overlayElement);

        if (!this.overlayInstance) {
          throw new Error('could not get overlay instance');
        }
        return this.overlayInstance;
      }
    })();
  }

  public dispose() {
    // clean up stuff when hot reloading
    if (this.scrollTrackerComponentManager) {
      this.scrollTrackerComponentManager.dispose();
    }

    if (this.scrollLockTimeout) {
      clearTimeout(this.scrollLockTimeout);
    }

    this.disposables.dispose();
  }

  public getNavigationInstance(): Promise<NavComponents[NavTemplateNames]> {
    return new Promise((resolve) => {
      if (this.navigation) {
        resolve(this.navigation);
      } else {
        this.navDisposables.add(
          addEventListener(this.element, NAV_IS_READY, async (event) => {
            // here we can gain access to nav element and component
            const navComponentName = (event as unknown as NavIsReadyEvent).detail;

            const navElement = this.getElement(`[data-component="${navComponentName}"]`);

            if (!navElement) {
              throw new Error('could not find navigation element to initialize in app');
            }

            const navInstance =
              getComponentForElement<NavComponents[typeof navComponentName]>(navElement);
            this.navigation = navInstance;

            const transitionIn = promisifyTimeline(
              navInstance.transitionController.transitionInTimeline,
            );
            // let's wait until component's transition in is done to get access to style props
            await transitionIn;

            resolve(navInstance);
            this.navDisposables.dispose();
          }),
        );
      }
    });
  }

  public async getNavigationHeight() {
    const nav = await this.getNavigationInstance();
    return nav?.element.clientHeight || 0;
  }
}
