import AbstractComponent from 'app/component/AbstractComponent';
import { TweenMax } from 'gsap';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { navigateTo } from 'muban-page-transition-controller';
import eases from '../../../animation/eases';
import { getAppComponent } from '../../../util/getElementComponent';
import { O35ArticleCardEvent } from './O35ArticleCard.utils';
import { O35ArticleCardProps } from './O35ArticleCard.types';

import './o35-article-card.scss';

export default class O35ArticleCard extends AbstractComponent {
  public static readonly displayName: string = 'o35-article-card';
  public static readonly HAS_ACTION = '-hasAction';
  public static readonly HAS_ONLY_LINK = '-hasOnlyLink';

  private readonly articleCardImageWrapper = this.getElement('[data-card-image]');
  private readonly cardImage = this.element.getElementsByTagName('img')[0];
  private readonly cardPublishedDate =
    this.getElement<HTMLParagraphElement>('[data-published-date]');
  private readonly cardTitle = this.getElement('[data-card-heading]');
  private readonly cardDescription = this.getElement<HTMLParagraphElement>('[data-card-copy]');
  private readonly link = this.getElement<HTMLAnchorElement>('[data-component="m06-link"]');
  private readonly actionIndicator = this.getElement<HTMLDivElement>('[data-action-indicator]');

  constructor(el: HTMLElement) {
    super(el);

    if (!this.isLink() && !this.hasDescription()) {
      this.hideActionIndicator();
    }

    if (!this.isLink() && this.hasDescription()) {
      this.addActionStyles();
      this.addDisposableEventListener(this.element, 'click', this.onCardClick.bind(this));
    }

    if (
      this.isLink() &&
      !this.hasDescription() &&
      !this.hasPublishDate() &&
      !this.hasHighlighted()
    ) {
      this.addOnlyLinkStyles();
    }

    this.articleCardImageWrapper &&
      this.addDisposableEventListener(
        this.articleCardImageWrapper,
        'mouseenter',
        this.onMouseEnter.bind(this),
      );

    this.articleCardImageWrapper &&
      this.addDisposableEventListener(
        this.articleCardImageWrapper,
        'mouseleave',
        this.onMouseLeave.bind(this),
      );
  }

  private async onCardClick(): Promise<void> {
    const { pageTransitionController, isLinkInternal } = await getAppComponent();
    const href = this.link && this.link.href;
    const {
      contentIndex = '',
      contentCategory = '',
      contentCategoryTotal = '',
    } = this.element.dataset;

    this.dispatcher.dispatchEvent(
      new O35ArticleCardEvent(O35ArticleCardEvent.types.CLICK, {
        content_index: contentIndex,
        content_category: contentCategory,
        content_category_total_count: contentCategoryTotal,
        title: this.cardTitle?.textContent || '',
        title_in_english: this.cardTitle?.dataset.titleInEnglish || '',
        link_url: href || '',
      }),
    );

    if (!pageTransitionController || !href) return;

    if (isLinkInternal(href)) {
      await navigateTo(pageTransitionController, href);
    } else {
      window.location.href = href;
    }
  }

  private onMouseEnter(): void {
    this.cardImage &&
      TweenMax.to(this.cardImage, 0.7, {
        scale: 1.1,
        ease: eases.VinnieInOut,
      });
  }

  private onMouseLeave(): void {
    this.cardImage &&
      TweenMax.to(this.cardImage, 0.7, {
        scale: 1,
        ease: eases.VinnieInOut,
      });
  }

  public isLink(): boolean {
    return !!this.link?.hasAttribute('href');
  }

  public hasDescription(): boolean {
    return !!this.cardDescription?.textContent && this.cardDescription.textContent.length > 0;
  }

  private hasPublishDate(): boolean {
    return !!this.cardPublishedDate?.textContent && this.cardPublishedDate.textContent.length > 0;
  }

  private hasHighlighted(): boolean {
    return !!this.element.dataset.highlighted;
  }

  private addActionStyles(): void {
    this.element.classList.add(O35ArticleCard.HAS_ACTION);
  }

  private hideActionIndicator(): void {
    this.actionIndicator?.classList.add(StateClassNames.HIDDEN);
  }

  private addOnlyLinkStyles(): void {
    this.element.classList.add(O35ArticleCard.HAS_ONLY_LINK);
  }
}
