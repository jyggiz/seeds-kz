import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C70CardGridTransitionController from './C70CardGridTransitionController';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import { updateClassForItems } from 'app/util/stateClassNamesToggle';
import { controlsStateToggle } from 'app/util/pagination/controlsStateToggle';
import App from '../../layout/app/App';
import { getAppComponent } from 'app/util/getElementComponent';
import O43Filter, {
  FilterOptions,
  paginationData,
} from 'app/component/organism/o43-filter/O43Filter.lazy';
import { cleanElement, getComponentForElement, registerComponent } from 'muban-core';
import { O55PaginationProps } from 'app/component/organism/o55-pagination/O55Pagination.types';
import { O57PaginationItemProps } from 'app/component/organism/o57-pagination-item/O57PaginationItem.types';
import { FilteredData } from 'app/component/organism/o43-filter/O43Filter.types';
import M22PersonCardProps from 'app/component/molecule/m22-person-card/M22PersonCard.types';
import O55PaginationTemplate from 'app/component/organism/o55-pagination/o55-pagination.hbs?include';
import M18ParagraphTemplate from 'app/component/molecule/m18-paragraph/m18-paragraph.hbs?include';
import M22PersonCardTemplate from 'app/component/molecule/m22-person-card/m22-person-card.hbs?include';
import emptyAllChildNodes from 'app/util/emptyAllChildNodes';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { MODAL } from 'app/util/overlayActionTypes';
import { O70ModalBioContentProps } from 'app/component/organism/o70-modal-bio-content/O70ModalBioContent.types';

import './c70-card-grid.scss';

const lazyO70Template = () =>
  import(
    '../../organism/o70-modal-bio-content/o70-modal-bio-content.hbs?include'
  ) as LoadTemplateImport<O70ModalBioContentProps>;

const PREVIOUS = 'previous';
const NEXT = 'next';
type PREVIOUS = typeof PREVIOUS;
type NEXT = typeof NEXT;
export default class C70CardGrid extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c70-card-grid';

  public readonly transitionController: C70CardGridTransitionController;

  private app: App | null = null;
  private filter = this.getElement(`[data-component="${O43Filter.displayName}"]`);
  private filterInstance = this.filter && getComponentForElement<O43Filter>(this.filter);
  private data = this.element.dataset.items && JSON.parse(this.element.dataset.items);
  private cards = this.getElements('[data-grid-item]');
  private paginationItems = this.getElements('[data-component="o57-pagination-item"]');
  private paginationPrevious = this.getElement('[data-pagination-previous]');
  private paginationNext = this.getElement('[data-pagination-next]');
  private initialRenderPaginationLimit: string;
  private paginationLimit = this.element.dataset.limit;
  private activePageIndex = 0;
  private gridContainer = this.getElement('[data-grid-container]');
  private cardsContainer = this.getElement('[data-grid-list]');
  private paginationContainer = this.getElement('[data-grid-controls]');
  private noResults = this.element.dataset.noResults;
  private tryAgain = this.element.dataset.tryAgain;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C70CardGridTransitionController(this);

    this.initialRenderPaginationLimit = this.paginationLimit ?? '12';

    this.addEventListeners();

    this.setControlsInitialState();
  }

  private setControlsInitialState() {
    controlsStateToggle(
      0,
      this.paginationItems.length,
      this.paginationNext,
      this.paginationPrevious,
    );
  }

  private addEventListeners() {
    this.cards.forEach((card, index) => {
      this.addDisposableEventListener(card, 'mouseenter', () => this.onCardMouseEnter(index));
      this.addDisposableEventListener(card, 'mouseleave', () => this.onCardMouseLeave());
      this.addDisposableEventListener(card, 'click', () => this.onCardClick(index));
    });

    this.paginationItems.forEach((pageElement, index) => {
      this.addDisposableEventListener(pageElement, 'click', () => {
        this.activePageIndex = index;
        this.onPaginationClick(index);
      });
    });

    this.paginationPrevious &&
      this.addListenerToPageTurnerElement(this.paginationPrevious, PREVIOUS);
    this.paginationNext && this.addListenerToPageTurnerElement(this.paginationNext, NEXT);
  }

  private addListenerToPageTurnerElement(element: HTMLElement, page: PREVIOUS | NEXT) {
    this.addDisposableEventListener(element, 'click', () => {
      page === PREVIOUS ? (this.activePageIndex -= 1) : (this.activePageIndex += 1);
      this.onPaginationClick(this.activePageIndex);
    });
  }

  private onCardMouseLeave() {
    this.cards.forEach((card) => card.classList.remove(StateClassNames.DISABLED));
  }

  private onCardMouseEnter(hoveredCardIndex: number) {
    this.cards.forEach(
      (card, index) => hoveredCardIndex !== index && card.classList.add(StateClassNames.DISABLED),
    );
  }

  private async onCardClick(index: number): Promise<void> {
    const data = this.data[index];

    const [o70Template, overlay] = await Promise.all([lazyO70Template(), this.app?.overlay]);

    if (data) {
      await overlay?.dispatchAction({
        type: MODAL.STANDARD_DYNAMIC,
        payload: {
          template: o70Template.default,
          data,
          options: {
            classnames: ['-fullBleedCarousel'],
          },
        },
      });
    }
  }

  private onPaginationClick(pageElementIndex: number): void {
    const pageElement = this.paginationItems[pageElementIndex];
    const { offset }: O57PaginationItemProps =
      pageElement.dataset.pagination && JSON.parse(pageElement.dataset.pagination);
    const paginationData = {
      offset: offset.toString(),
      limit: this.paginationLimit ?? this.initialRenderPaginationLimit,
    };
    if (this.filterInstance) {
      this.filterInstance.handleFilterSubmit(paginationData);
    }

    const { paginationItems, paginationNext, paginationPrevious } = this;

    updateClassForItems({
      removeFrom: this.paginationItems,
      addToOne: this.paginationItems[pageElementIndex],
      className: StateClassNames.ACTIVE,
    });

    controlsStateToggle(
      pageElementIndex,
      paginationItems.length,
      paginationNext,
      paginationPrevious,
    );
  }

  private setPaginationUrlParams(paginationData?: paginationData) {
    return !paginationData
      ? `?offset=0&limit=${this.paginationLimit}&`
      : `?offset=${paginationData.offset}&limit=${this.paginationLimit}&`;
  }

  private updateComponent({ response }: FilteredData) {
    if ('items' in response.data) {
      const cardsData = response.data.items;
      const paginationData = response.data.pagination;

      if (this.cardsContainer) this.cleanUpElement(this.cardsContainer);
      if (this.paginationContainer) this.cleanUpElement(this.paginationContainer);

      if (cardsData.length === 0) {
        this.renderNoResultsMessage();
      } else {
        this.renderCards(cardsData);
        this.renderPagination(paginationData);
      }

      this.updateDataAttributes(cardsData, paginationData);
      this.updateReferencesToCardAndPaginationNodes();

      controlsStateToggle(
        this.activePageIndex,
        this.paginationItems.length,
        this.paginationNext,
        this.paginationPrevious,
      );

      this.disposables.dispose();
      this.addEventListeners();
    } else {
      console.log(new Error('The response json is not formatted correctly.'));
    }
  }

  private updateReferencesToCardAndPaginationNodes() {
    this.data = this.element.dataset.items && JSON.parse(this.element.dataset.items);
    this.cards = this.getElements('[data-grid-item]');
    this.paginationItems = this.getElements('[data-component="o57-pagination-item"]');
    this.paginationPrevious = this.getElement('[data-pagination-previous]');
    this.paginationNext = this.getElement('[data-pagination-next]');
    this.paginationLimit = this.element.dataset.limit ?? this.initialRenderPaginationLimit;
  }

  private updateDataAttributes(
    cardsData: M22PersonCardProps[],
    paginationData: O55PaginationProps,
  ) {
    this.element.setAttribute('data-items', JSON.stringify(cardsData));
    this.element.setAttribute('data-limit', paginationData.limit.toString());
  }

  private cleanUpElement(element: HTMLElement) {
    cleanElement(element);
    emptyAllChildNodes(element);
  }

  private renderNoResultsMessage() {
    if (this.gridContainer) {
      renderItem(this.gridContainer, M18ParagraphTemplate, {
        heading: {
          size: 'h4',
          text: this.noResults,
        },
        copy: {
          content: this.tryAgain,
        },
      });
    }
  }

  private renderCards(cardsData: M22PersonCardProps[]) {
    if (this.cardsContainer) {
      cardsData.forEach((cardData) => {
        const liElement = document.createElement('li');
        liElement.classList.add('b-cardGrid__item');
        liElement.setAttribute('data-grid-item', '');
        renderItem(liElement, M22PersonCardTemplate, cardData);
        this.cardsContainer!.appendChild(liElement);
      });
      if (this.cardsContainer.getBoundingClientRect().top < 0) {
        this.element.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      }
    }
  }

  private renderPagination(paginationData: O55PaginationProps) {
    if (this.paginationContainer) {
      if (paginationData.pages.length > 1) {
        this.activePageIndex = paginationData.pages.findIndex((page) => page.active);
        renderItem(this.paginationContainer, O55PaginationTemplate, paginationData);
      }
    }
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.app = await getAppComponent();

    const locale = this.app.element.getAttribute('lang');

    if (this.filterInstance) {
      if (this.filterInstance) {
        const options: FilterOptions = {
          updateParentComponent: this.updateComponent.bind(this),
          setPaginationUrlParams: this.setPaginationUrlParams.bind(this),
          localeUrlParams: `locale=${locale}&`,
        };
        this.filterInstance.registerFilterOptions(options);
      }
    }
  }
}
