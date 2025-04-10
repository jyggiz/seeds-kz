import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { LIGHTBOX_ACTIONS } from 'app/component/block/s09-overlay/S09Overlay.types';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { LIGHTBOX } from 'app/util/overlayActionTypes';
import { cleanElement, getComponentForElement, initComponents } from 'muban-core';
import { getAppComponent } from '../../../util/getElementComponent';
import type App from '../../layout/app/App';
import O38LightboxTransitionController from './O38LightboxTransitionController';
import { addEscapeKeyListener } from '../../../util/keyboardUtils';
import { trapFocus, trappedFocusType } from '../../../util/trapFocus';
import O01Video from '../o01-video/O01Video.lazy';
import { lazyLoadComponents } from 'app/lazyLoadComponents';

import './o38-lightbox.scss';

export default class O38Lightbox extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o38-lightbox';

  public readonly transitionController: O38LightboxTransitionController;

  private readonly closeButton: HTMLButtonElement | null =
    this.element.querySelector('[data-close-button]');
  private readonly mask = this.element.querySelector('[data-lightbox-mask]');
  private readonly lightboxContainer = this.getElement('[data-lightbox-container]');
  private readonly modalI18n = this.element.dataset.i18n && JSON.parse(this.element.dataset.i18n);

  private app: App | null = null;
  private videoPlayers: Array<O01Video> = [];
  private trappedFocus: trappedFocusType;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O38LightboxTransitionController(this);
  }

  private addEventListeners() {
    [this.closeButton, this.mask].forEach((element) => {
      if (element) {
        this.addDisposableEventListener(element, 'click', this.dispatchCloseAction);
      }
    });
  }

  public async adopted() {
    this.app = await getAppComponent();

    this.addEventListeners();

    // Subscribe to overlay events
    this.addDisposableEventListener(this.app?.element, 'overlayAction', async (event) => {
      await this.handleAction((event as unknown as CustomEvent).detail);
    });
  }

  private dispatchCloseAction = async () => {
    const overlay = await this.app?.overlay;

    await overlay?.dispatchAction({ type: LIGHTBOX.CLOSE });
  };

  public handleAction = async (action: LIGHTBOX_ACTIONS) => {
    switch (action.type) {
      case LIGHTBOX.STANDARD_DYNAMIC: {
        const { template, data, options } = action.payload;

        if (options?.classnames) {
          options.classnames.forEach((name) => this.element.classList.add(name));
        }

        const previousArrowButtonLabel = this.modalI18n?.common?.previousArrowCta || '';
        const nextArrowButtonLabel = this.modalI18n?.common?.nextArrowCta || '';

        const markup = template({ ...data, previousArrowButtonLabel, nextArrowButtonLabel });

        await this.openDynamic(markup);
        break;
      }
      case LIGHTBOX.CLOSE: {
        await this.closeLightbox();

        break;
      }
    }
  };

  public async openDynamic(markup: string): Promise<void> {
    if (this.lightboxContainer == null) {
      throw new Error('this.videoContainer is undefined');
    }
    this.element.classList.add(StateClassNames.OPEN);

    this.scrollEnabled = false;
    this.lightboxContainer.innerHTML = markup;

    const didLazyLoad = await lazyLoadComponents(this.lightboxContainer);

    if (!didLazyLoad) {
      await initComponents(this.lightboxContainer);
    }

    const videoPlayerElements: Array<HTMLElement> = Array.from(
      this.lightboxContainer.querySelectorAll(`[data-component="o01-video"]`),
    );

    this.videoPlayers = videoPlayerElements.map((videoPlayerElement) =>
      getComponentForElement<O01Video>(videoPlayerElement),
    );

    addEscapeKeyListener(this.dispatchCloseAction);

    this.trappedFocus = trapFocus(this.element);

    return this.transitionIn();
  }

  public async closeLightbox(): Promise<void> {
    if (this.lightboxContainer === null) {
      throw new Error('The lightbox container was not found');
    }

    if (this.videoPlayers.length > 0) {
      const pausePromises: Array<Promise<void>> = this.videoPlayers.map((videoPlayer) =>
        videoPlayer.player.pause(),
      );

      await Promise.all(pausePromises);

      this.videoPlayers.forEach((videoPlayer) => {
        videoPlayer.player.clearTimeupdateInterval();
      });
    }

    this.element.classList.remove(StateClassNames.OPEN);
    this.scrollEnabled = true;
    this.trappedFocus?.removeFocus();

    cleanElement(this.lightboxContainer);
    return this.transitionOut();
  }

  private set scrollEnabled(isEnabled: boolean) {
    if (!this.app) throw new Error('The app component cannot be found');
    this.app.toggleScroll(isEnabled);
  }
}
