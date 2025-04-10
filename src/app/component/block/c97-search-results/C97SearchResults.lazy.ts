import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C97SearchResultsTransitionController from './C97SearchResultsTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import M06Link from '../../molecule/m06-link/M06Link';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import A07Label from '../../atom/a07-label/A07Label';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import deviceStateTracker from '../../../util/deviceStateTracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { O35ArticleCardEvent } from '../../organism/o35-article-card/O35ArticleCard.utils';
import O35ArticleCard from '../../organism/o35-article-card/O35ArticleCard.lazy';
import trackEvent, { TrackingEventNames } from '../../../util/TrackingEvent';
import O88SearchBar from '../../organism/o88-search-bar/O88SearchBar';

import './c97-search-results.scss';

export default class C97SearchResults extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c97-search-results';

  public readonly transitionController: C97SearchResultsTransitionController;

  private readonly defaultNumberOfCardsDesktop = 4;
  private readonly defaultNumberOfCardsMobile = 2;
  private isMobile: boolean = false;

  private readonly buttons = this.getElements(
    `[data-list-control] > [data-component="${M06Link.displayName}"]`,
  );
  private readonly cards = this.getElements('[data-cards]');

  private readonly showButtonCopy: string = this.element.dataset.showButtonCopy || '';

  private readonly hideButtonCopy: string = this.element.dataset.hideButtonCopy || '';

  private readonly linkClassName = this.getElement(`[data-component="${A07Label.displayName}"]`)
    ?.classList[0];

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C97SearchResultsTransitionController(this);

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);

    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    this.addEventListeners();
    this.updateCards();
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.SMALL;
    this.updateCards();
  }

  updateCards() {
    this.cards.forEach((card, index) => {
      const defaultNumberOfCards = this.isMobile
        ? this.defaultNumberOfCardsMobile
        : this.defaultNumberOfCardsDesktop;
      this.buttons[index].style.display =
        card.childElementCount > defaultNumberOfCards ? 'inline-flex' : 'none';
    });
  }

  private addEventListeners(): void {
    this.buttons.forEach((button, index) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (this.cards[index].classList.contains(StateClassNames.EXPANDED)) {
          if (this.linkClassName)
            button.getElementsByClassName(this.linkClassName)[0].innerHTML = this.showButtonCopy;
          this.cards[index].classList.remove(StateClassNames.EXPANDED);
        } else {
          if (this.linkClassName)
            button.getElementsByClassName(this.linkClassName)[0].innerHTML = this.hideButtonCopy;
          this.cards[index].classList.add(StateClassNames.EXPANDED);
        }
      });
    });
  }

  public adopted() {
    setAsInitialised(this.element);
    const searchParams = new URLSearchParams(window.location.search);
    const searchTerm = searchParams.get(O88SearchBar.searchParam);

    this.getComponents<O35ArticleCard>(O35ArticleCard.displayName).forEach((articleCard) => {
      this.addDisposableEventListener<O35ArticleCardEvent>(
        articleCard.dispatcher,
        O35ArticleCardEvent.types.CLICK,
        ({ data }) => {
          trackEvent({
            event: TrackingEventNames.SEARCH_RESULT_CLICK,
            search_term: searchTerm || '',
            content: [
              {
                content_index: data.content_index,
                content_type: 'article',
                content_category: data.content_category,
                content_title: data.title,
                content_title_in_english: data.title_in_english,
                content_category_total_count: data.content_category_total_count,
                link_url: data.link_url,
              },
            ],
          });
        },
      );
    });
  }
}
