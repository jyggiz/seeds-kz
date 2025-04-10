import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O90CardWaterfallTransitionController from './O90CardWaterfallTransitionController';
import { getAppComponent } from '../../../util/getElementComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { POPUP } from '../../../util/overlayActionTypes';
import App from '../../layout/app/App';
import { O49PopupExpertContentProps } from '../o49-popup-expert-content/O49PopupExpertContent.types';

import './o90-card-waterfall.scss';

const lazyO49Template = () =>
  import(
    '../o49-popup-expert-content/o49-popup-expert-content.hbs?include'
  ) as LoadTemplateImport<O49PopupExpertContentProps>;

export default class O90CardWaterfall extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o90-card-waterfall';

  public readonly transitionController: O90CardWaterfallTransitionController;

  private expertItems = this.getElements('[data-expert-item]');

  private activeIndex: number = -1;
  public isPopupOpen: boolean = false;

  public activeCard: HTMLElement | null = null;
  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O90CardWaterfallTransitionController(this);

    this.addEventListeners();
  }

  public async adopted() {
    this.app = await getAppComponent();

    this.addDisposableEventListener(this.app?.element, 'overlayAction', (event) => {
      if ((event as unknown as CustomEvent).detail.type === POPUP.CLOSE) {
        this.isPopupOpen = false;
        this.resetCards();

        this.popupClosed();
        this.app?.toggleScroll(true);
        this.app?.transformCursor(false);
      }
    });
  }

  private addEventListeners(): void {
    this.expertItems.forEach((item, index) => {
      this.addDisposableEventListener(item, 'mouseenter', () => {
        this.onMouseEnterItem(index);
      });
    });

    this.expertItems.forEach((item) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.onClickItem(item);
      });
    });

    this.expertItems.forEach((item) => {
      this.addDisposableEventListener(item, 'mouseout', () => {
        if (this.isPopupOpen) return;
        this.onMouseOutItem();
      });
    });
  }

  private async onClickItem(card: HTMLElement): Promise<void> {
    if (this.app === null) throw new Error('App was not found');

    this.activeCard = card;
    this.isPopupOpen = true;

    this.app?.toggleScroll(false);

    const cardOffset = card.getBoundingClientRect();
    const expertContent = card.dataset.expertContent && JSON.parse(card.dataset.expertContent);

    const cardInformation: any = {
      x: cardOffset.left,
      y: cardOffset.top,
      width: card.offsetWidth,
      height: card.offsetHeight,
    };

    card.classList.add(StateClassNames.EXPANDED);
    const overlay = await this.app?.overlay;

    await overlay.dispatchAction({
      type: POPUP.STANDARD_DYNAMIC,
      payload: {
        template: (await lazyO49Template()).default,
        data: {
          content: expertContent,
          cardInformation,
        },
        options: {
          classnames: ['-isExpertPopup'],
        },
      },
    });

    this.app.transformCursor(true, 'cross');
  }

  private onMouseEnterItem(index: number): void {
    if (this.app === null) throw new Error('App was not found');
    this.app.transformCursor(true, 'plus-big');

    this.activeIndex = index;

    this.expertItems.forEach((expertCard, index) => {
      if (index === this.activeIndex) {
        expertCard.classList.add(StateClassNames.ACTIVE);
        expertCard.classList.remove(StateClassNames.DISABLED);
      } else {
        expertCard.classList.add(StateClassNames.DISABLED);
      }
    });
  }

  public resetCards(): void {
    this.expertItems.forEach((expertCard) => {
      expertCard.classList.remove(StateClassNames.ACTIVE);
      expertCard.classList.remove(StateClassNames.DISABLED);
    });
  }

  private onMouseOutItem(): void {
    if (this.app === null) throw new Error('App was not found');
    this.app.transformCursor(false);

    this.resetCards();
  }

  public popupClosed() {
    if (this.activeCard) {
      this.activeCard.classList.remove(StateClassNames.EXPANDED);
    }
  }
}
