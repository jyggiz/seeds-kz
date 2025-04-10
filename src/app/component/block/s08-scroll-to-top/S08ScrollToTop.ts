import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import App from '../../layout/app/App';
import C42NavigationTiles from '../c42-navigation-tiles/C42NavigationTiles';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import M02Button from 'app/component/molecule/m02-button/M02Button';
import mq from '../../../data/shared-variable/media-queries.json';
import S08ScrollToTopTransitionController from './S08ScrollToTopTransitionController';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import { getAppComponent } from '../../../util/getElementComponent';
import { TweenMax } from 'gsap';
import { debounce } from 'lodash-es';

export default class S08ScrollToTop extends AbstractTransitionComponent {
  public static readonly displayName: string = 's08-scroll-to-top';

  private readonly scrollToTopButton = this.getElement<HTMLButtonElement>(
    `[data-component='${M02Button.displayName}']`,
  );
  public readonly navigationTiles = this.getElement(
    `[data-component="${C42NavigationTiles.displayName}"]`,
    document.body,
  );
  public isMobile: boolean = false;

  public readonly transitionController: S08ScrollToTopTransitionController;
  private app: App | null = null;
  private isVisible: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new S08ScrollToTopTransitionController(this);

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    if (this.scrollToTopButton) {
      this.addDisposableEventListener(
        this.scrollToTopButton,
        'click',
        this.onScrollToTopButtonClick.bind(this),
      );
    }

    this.addDisposableEventListener(
      window,
      'scroll',
      debounce(this.updateScrollToTopButtonVisibility.bind(this), 100),
    );
  }

  public async adopted() {
    this.app = await getAppComponent();
    this.updateScrollToTopButtonVisibility();
  }

  private async onScrollToTopButtonClick(): Promise<void> {
    if (this.app) {
      this.app.scrollToTop();
    }
  }

  public setScrollToTopButtonVisibility(visible: boolean) {
    if (this.isVisible === visible) {
      return;
    }

    TweenMax.to(this.element, 0.3, {
      display: visible ? 'inline-flex' : 'none',
    });

    this.isVisible = visible;
  }

  public updateScrollToTopButtonVisibility(): void {
    if (this.isMobile) return;

    const navigationTilesOffsetHeight = this.navigationTiles?.offsetHeight || 0;

    const scrollLimit = document.body.scrollHeight - navigationTilesOffsetHeight;

    const buttonAppearanceScrollHeight = 120;

    const isScrollLimitPassed = scrollY >= scrollLimit || scrollY <= buttonAppearanceScrollHeight;

    this.setScrollToTopButtonVisibility(!isScrollLimitPassed);
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.SMALL;
  }
}
