import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C100CardsTransitionController from './C100CardsTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import gsap, { TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import O35ArticleCard from '../../organism/o35-article-card/O35ArticleCard.lazy';
import { O09ModalCarouselContentProps } from '../../organism/o09-modal-carousel-content/O09ModalCarouselContent.types';
import App from '../../layout/app/App';
import { MODAL } from '../../../util/overlayActionTypes';
import { getAppComponent } from '../../../util/getElementComponent';
import { C100CardsProps } from './C100Cards.types';

const lazyO09Template = () =>
  import(
    '../../organism/o09-modal-carousel-content/o09-modal-carousel-content.hbs?include'
  ) as LoadTemplateImport<O09ModalCarouselContentProps>;

import './c100-cards.scss';

export default class C100Cards extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c100-cards';

  public readonly transitionController: C100CardsTransitionController;

  private app: App | null = null;

  private readonly cards = this.getComponents<O35ArticleCard>(O35ArticleCard.displayName).filter(
    (component) => {
      return !component.isLink() && component.hasDescription();
    },
  );

  private payload: O09ModalCarouselContentProps = {
    activeItemIndex: 0,
    variant: 'fullBleedCarousel',
    highlightHotspots: true,
    items: this.getCardsData().filter(
      ({ outerContent: { link, copy } }) => !link.href && copy && copy.length > 0,
    ),
  };

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C100CardsTransitionController(this);
    this.addEventListeners();
  }

  private getCardsData(): C100CardsProps['cards'] {
    try {
      return JSON.parse(<string>this.element.dataset.cards);
    } catch (error) {
      throw new Error("Couldn't find the cards data!");
    }
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.cards.forEach((card) => {
      const imageWrapper = card.getElement<HTMLElement>('.o-articleCard__image');
      const content = card.getElement<HTMLElement>('.o-articleCard__content');

      this.addDisposableEventListener(card.element, 'click', () => this.openModal(card.element));

      this.addDisposableEventListener(card.element, 'mouseenter', () =>
        this.onCardHover(card.element, imageWrapper, content, true),
      );

      this.addDisposableEventListener(card.element, 'mouseleave', () => {
        this.onCardHover(card.element, imageWrapper, content);
      });
    });
  }

  private async openModal(element: HTMLElement): Promise<void> {
    const [o09Template, overlay] = await Promise.all([lazyO09Template(), this.app?.overlay]);

    const fullBleedCarouselVariant = 'fullBleedCarousel';

    this.payload.activeItemIndex = this.getCardIndex(element);

    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: o09Template.default,
        data: this.payload,
        options: {
          classnames: [`-${fullBleedCarouselVariant}`],
        },
      },
    });
  }

  private getCardIndex(target: HTMLElement): number {
    return this.cards.findIndex((component) => component.element === target);
  }

  private animateElement(element: HTMLElement, animationOptions: gsap.TweenConfig): void {
    TweenMax.to(element, 0.7, {
      ...animationOptions,
      ease: eases.VinnieInOut,
    });
  }

  private onCardHover(
    card: HTMLElement,
    imageWrapper: HTMLElement | null,
    content: HTMLElement | null,
    isActive = false,
  ): void {
    imageWrapper && this.animateElement(imageWrapper, { scale: isActive ? 1.5 : 1 });
    content && this.animateElement(content, { y: isActive ? 60 : 0 });
    this.animateElement(card, { height: isActive ? '120%' : '100%' });
  }
}
