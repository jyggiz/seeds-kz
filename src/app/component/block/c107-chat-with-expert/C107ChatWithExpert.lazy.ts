import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C107ChatWithExpertTransitionController from './C107ChatWithExpertTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import M48SliderPagination from '../../molecule/m48-slider-pagination/M48SliderPagination';
import O89ExpertInformation from '../../organism/o89-expert-information/O89ExpertInformation.lazy';
import { getComponentForElement } from 'muban-core';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import FontFaceObserver from 'fontfaceobserver';
import { FontFamilyNames } from '../../../data/enum/FontFamilyNames';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { isEditor } from '../../../util/aemEditorUtils';
import { TweenMax } from 'gsap';
import { Key } from 'ts-key-enum';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import ChatDetails from './component/organism/chat-details/ChatDetails.lazy';
import { ChatDetailsProps } from './component/organism/chat-details/ChatDetails.types';
import { MODAL } from '../../../util/overlayActionTypes';
import App from '../../layout/app/App';
import { getAppComponent } from '../../../util/getElementComponent';
import { C107Slide } from './C107ChatWithExpert.types';

import './c107-chat-with-expert.scss';
import './component/organism/chat-quote/chat-quote.scss';
import './component/organism/chat-details/chat-details.scss';

const lazyChatDetailsTemplate = () =>
  import(
    './component/organism/chat-details/chat-details.hbs?include'
  ) as LoadTemplateImport<ChatDetailsProps>;

export default class C107ChatWithExpert extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c107-chat-with-expert';

  private app: App | null = null;
  public readonly transitionController: C107ChatWithExpertTransitionController;
  private paginationWrapper = this.getElement(
    `[data-component="${M48SliderPagination.displayName}"]`,
  )?.parentElement;
  private outerGridContainerElement = this.getElement('[data-expert-grid-outer-container]');
  private readonly slideElements = this.getElements<HTMLUListElement>('[data-slide]');
  private readonly slides: C107Slide[] = this.slideElements.map((slideElement) => {
    const informationElement = this.getElement(
      `[data-component="${O89ExpertInformation.displayName}"]`,
      slideElement,
    );

    const informationComponent = informationElement
      ? getComponentForElement<O89ExpertInformation>(informationElement)
      : null;

    const chatQuote = this.getElement('[data-chat-quote]', slideElement);
    const chatDetails = this.getComponent<ChatDetails>(ChatDetails.displayName, slideElement);
    const expertBio = this.getElement('[data-expert-bio]', slideElement);

    return {
      expertBio,
      chatQuote,
      chatDetails,
      information: informationComponent,
      element: slideElement,
    };
  });
  private slider = this.getElement('[data-slider]');
  private paginationBars = this.getElements(
    `[data-component="${M48SliderPagination.displayName}"] [data-pagination-bar]`,
  );

  private previousButton = this.getElement('[data-previous-button]');
  private nextButton = this.getElement('[data-next-button]');
  private indicators = this.getElements(`[data-indicator]`);

  private activeSlideIndex = 0;

  private isMobile: boolean = false;

  private scrollRaf = 0;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C107ChatWithExpertTransitionController(this);

    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );
  }

  public async adopted(): Promise<void> {
    setAsInitialised(this.element);

    const requiredFont = new FontFaceObserver(FontFamilyNames.BROWN);

    try {
      await requiredFont.load();
    } catch (e) {
      throw new Error(requiredFont + ' timed out.');
    }
    this.app = await getAppComponent();
    this.addEventListeners();
    this.tick();
  }

  private setChatState(
    chatDetails: HTMLElement,
    chatQuote: HTMLElement,
    state: 'quote' | 'details',
  ) {
    chatQuote.classList.toggle(StateClassNames.HIDDEN, state != 'quote');
    chatDetails.classList.toggle(StateClassNames.HIDDEN, state != 'details');

    if (state === 'quote') {
      chatQuote.dataset.visible = 'true';
      chatDetails.dataset.visible = 'false';
    }
    if (state === 'details') {
      chatQuote.dataset.visible = 'false';
      chatDetails.dataset.visible = 'true';
    }
  }

  private onCloseClick(chatDetails: ChatDetails, chatQuote: HTMLElement) {
    this.setChatState(chatDetails.element, chatQuote, 'quote');
    if (this.paginationWrapper) {
      this.paginationWrapper.style.opacity = '1';
    }
  }

  private async onReadMoreClick(
    slide: HTMLElement,
    chatDetails: ChatDetails,
    chatQuote: HTMLElement,
  ) {
    if (this.isMobile) {
      const data = JSON.parse(slide.dataset.item || '');

      const [chatDetailsTemplate, overlay] = await Promise.all([
        lazyChatDetailsTemplate(),
        this.app?.overlay,
      ]);
      await overlay?.dispatchAction({
        type: MODAL.STANDARD_DYNAMIC,
        payload: {
          template: chatDetailsTemplate.default,
          data: {
            ...data,
            heading: {
              ...data.heading,
              size: 'h4',
            },
          },
        },
      });
      return;
    }
    this.setChatState(chatDetails.element, chatQuote, 'details');
    if (this.paginationWrapper) {
      this.paginationWrapper.style.opacity = '0';
    }
  }

  private addEventListeners(): void {
    this.paginationBars.forEach((paginationBar, index) => {
      const onPaginationBarClick = (): void => {
        this.activeSlideIndex = index;
      };

      paginationBar.tabIndex = 0;

      this.addDisposableEventListener(paginationBar, 'click', onPaginationBarClick);
      this.addDisposableEventListener(paginationBar, 'keydown', (event: KeyboardEvent) => {
        if (event.key !== Key.Enter) return;

        onPaginationBarClick();
      });
    });

    if (this.previousButton)
      this.addDisposableEventListener(this.previousButton, 'click', () => {
        this.activeSlideIndex = this.activeSlideIndex - 1;
      });

    if (this.nextButton)
      this.addDisposableEventListener(this.nextButton, 'click', () => {
        this.activeSlideIndex = this.activeSlideIndex + 1;
      });

    this.slides.map(({ element, chatDetails, chatQuote }) => {
      const readMoreButton = this.getElement('[data-more-button]', element);
      const closeButton = this.getElement('[data-close-button]', element);

      if (!readMoreButton || !closeButton) {
        return;
      }

      this.addDisposableEventListener(readMoreButton, 'click', () => {
        if (!chatDetails || !chatQuote) {
          return;
        }
        this.onReadMoreClick(element, chatDetails, chatQuote);
      });

      this.addDisposableEventListener(closeButton, 'click', () => {
        if (!chatDetails || !chatQuote) {
          return;
        }
        this.onCloseClick(chatDetails, chatQuote);
      });
    });
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.LARGE_LANDSCAPE;
  }

  private tick(): void {
    if (isEditor()) return;

    if (this.slider)
      TweenMax.set(this.slider, {
        height: this.slides[this.activeSlideIndex].element.clientHeight,
      });

    this.slides[this.activeSlideIndex].element.classList.add(StateClassNames.ACTIVE);
    const activeChatDetails = this.slides[this.activeSlideIndex].chatDetails;
    if (activeChatDetails) {
      activeChatDetails.element.dataset.active = 'true';
    }

    this.slides
      .filter((slide, index) => index !== this.activeSlideIndex)
      .forEach((slide) => {
        slide.element.classList.remove(StateClassNames.ACTIVE);
        const inactiveChatDetails = slide.chatDetails;
        if (inactiveChatDetails) {
          inactiveChatDetails.element.dataset.active = 'false';
        }
      });

    if (this.paginationBars.length) {
      this.paginationBars[this.activeSlideIndex].classList.add(StateClassNames.ACTIVE);
    }
    this.paginationBars
      .filter((bar, index) => index !== this.activeSlideIndex)
      .forEach((bar) => bar.classList.remove(StateClassNames.ACTIVE));

    if (this.outerGridContainerElement) {
      const indicatorsWrapper =
        this.indicators && this.indicators[0] && this.indicators[0].parentElement;

      if (indicatorsWrapper) {
        const indicatorsBottomSpace = 40;
        TweenMax.set(indicatorsWrapper, {
          position: 'absolute',
          top: this.element.clientHeight - indicatorsBottomSpace,
          width: '100%',
        });
      }

      if (this.paginationWrapper && !this.isMobile) {
        const paginationDesktopMargin = 160;

        TweenMax.set(this.paginationWrapper, {
          position: 'absolute',
          top: paginationDesktopMargin,
          bottom: 'initial',
        });
      }
    }

    this.scrollRaf = requestAnimationFrame(this.tick.bind(this));

    if (!this.previousButton || !this.nextButton) {
      return;
    }

    if (this.activeSlideIndex <= 0) {
      this.previousButton.setAttribute('disabled', 'true');
    } else {
      this.previousButton.removeAttribute('disabled');
    }

    if (this.activeSlideIndex >= this.slides.length - 1) {
      this.nextButton.setAttribute('disabled', 'true');
    } else {
      this.nextButton?.removeAttribute('disabled');
    }

    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle(StateClassNames.ACTIVE, index === this.activeSlideIndex);
    });
  }

  public dispose() {
    super.dispose();
    cancelAnimationFrame(this.scrollRaf);
  }
}
