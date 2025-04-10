import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C99BlocksListTransitionController from './C99BlocksListTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import App from 'app/component/layout/app/App';
import { O09ModalCarouselContentProps } from 'app/component/organism/o09-modal-carousel-content/O09ModalCarouselContent.types';
import { MODAL } from 'app/util/overlayActionTypes';
import { getAppComponent } from 'app/util/getElementComponent';
import O93BlockCta from 'app/component/organism/o93-block-cta/O93BlockCta';
import O93BlockCtaEvent from 'app/component/organism/o93-block-cta/O93BlockCtaEvent';
import { O93BlockCtaTypes } from '../../organism/o93-block-cta/O93BlockCta.types';

import './c99-blocks-list.scss';

const lazyO09Template = () =>
  import(
    '../../organism/o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;

export default class C99BlocksList extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c99-blocks-list';

  public readonly transitionController: C99BlocksListTransitionController;
  private app: App | null = null;
  private o93BlockCtaComponents = this.getComponents<O93BlockCta>(O93BlockCta.displayName).filter(
    (component) => {
      const { type } = component.getPayload();
      return type === O93BlockCtaTypes.MODAL;
    },
  );

  private payload: O09ModalCarouselContentProps = {
    activeItemIndex: 0,
    variant: 'fullBleedCarousel',
    highlightHotspots: true,
    items: this.o93BlockCtaComponents.map((component) => {
      const { heading, description, background } = component.getPayload();
      const htmlParser = new DOMParser();
      return {
        content: {
          heading: {
            text: htmlParser.parseFromString(heading, 'text/html').body.textContent || '',
          },
          copy: description,
          preview: background.video,
          image: background.image,
        },
      };
    }),
  };

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C99BlocksListTransitionController(this);
    this.addEventListeners();
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.app = await getAppComponent();
  }

  private addEventListeners() {
    this.o93BlockCtaComponents.forEach((component) => {
      this.addDisposableEventListener<O93BlockCtaEvent>(
        component.dispatcher,
        O93BlockCtaEvent.OPEN_MODAL,
        ({ element }) => this.openModal(element),
      );
    });
  }

  private async openModal(element: HTMLElement) {
    this.payload.activeItemIndex = this.getBlockItemIndex(element);

    const overlay = await this.app?.overlay;
    overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: (await lazyO09Template()).default,
        data: this.payload,
        options: {
          classnames: ['-fullBleedCarousel'],
        },
      },
    });
  }

  private getBlockItemIndex(target: HTMLElement): number {
    return this.o93BlockCtaComponents.findIndex((component) => component.element === target);
  }
}
