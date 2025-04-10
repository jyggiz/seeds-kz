import { TweenMax } from 'gsap';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { getComponentForElement } from 'muban-core';
import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C46MediaListTransitionController from './C46MediaListTransitionController';
import { getAppComponent } from '../../../util/getElementComponent';
import TrackingEvent from '../../../util/TrackingEvent';
import App from '../../layout/app/App';
import O43Filter, {
  FilterOptions,
  paginationData,
} from 'app/component/organism/o43-filter/O43Filter.lazy';
import { updateClassForItems } from 'app/util/stateClassNamesToggle';
import { controlsStateToggle } from 'app/util/pagination/controlsStateToggle';
import { renderFilteredItems } from 'app/util/filter/renderFilteredItems';
import { renderUpdatedPagination } from '../../../util/filter/renderUpdatedPagination';
import { FilteredData } from 'app/component/organism/o43-filter/O43Filter.types';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import emptyAllChildNodes from 'app/util/emptyAllChildNodes';
import { post } from 'app/util/fetch/postRequest';
import { saveAs } from 'app/util/saveAs';
import { LIGHTBOX } from 'app/util/overlayActionTypes';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O39LightboxContentProps from 'app/component/organism/o39-lightbox-content/O39LightboxContent.types';
import O40LightboxItemProps from 'app/component/organism/o40-lightbox-item/O40LightboxItem.types';

ScrollToPlugin;

import './c46-media-list.scss';

const lazyO39Template = () =>
  import(
    '../../organism/o39-lightbox-content/o39-lightbox-content.hbs?include'
  ) as LoadTemplateImport<O39LightboxContentProps>;
export default class C46MediaList extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c46-media-list';
  public readonly transitionController: C46MediaListTransitionController;

  private filter = this.getElement(`[data-component="${O43Filter.displayName}"]`);
  private filterInstance: O43Filter | null = null;
  private warningMessage: HTMLElement | null = this.getElement('[data-warning-message]');
  private mediaCardContents = this.getElements('[data-media-content]');
  private mediaCheckboxes = this.getElements('[data-media-checkbox]') as Array<HTMLInputElement>;
  private mediaCheckboxLabels = this.getElements(
    '[data-media-checkbox-label]',
  ) as Array<HTMLInputElement>;
  private labelsData =
    this.element.dataset.checkboxLabels && JSON.parse(this.element.dataset.checkboxLabels);
  private pagination = this.getElement('[data-component="o55-pagination"]');
  private paginationItems = this.getElements('[data-component="o57-pagination-item"]');
  private paginationPrevious = this.getElement('[data-pagination-previous]');
  private paginationNext = this.getElement('[data-pagination-next]');
  private activeIndex: number = 0;
  private paginationLimit = this.pagination?.dataset.limit ?? '12';
  private pageElementsUpdated: boolean = false;
  private readonly eventTrackingData =
    this.element.dataset.eventTracking && JSON.parse(this.element.dataset.eventTracking);
  private lightboxData: O39LightboxContentProps['content'] | undefined = undefined;
  private mediaItemsContainer = this.getElement('[data-media-items]');
  private paginationList = this.getElement('[data-pagination-items]');
  private listElementClassName: string | null | undefined =
    this.mediaItemsContainer && this.mediaItemsContainer.querySelector('li')?.className;
  private isAemEnvironment = document && document.getElementsByClassName('root responsivegrid')[0];

  private app: App | null = null;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new C46MediaListTransitionController(this);
    this.addEventListeners();
  }

  public async adopted() {
    setAsInitialised(this.element);
    this.app = await getAppComponent();
    if (this.filter) this.filterInstance = getComponentForElement<O43Filter>(this.filter);
    if (this.filterInstance) {
      const options: FilterOptions = {
        updateParentComponent: this.updateComponent.bind(this),
        setPaginationUrlParams: this.setPaginationUrlParams.bind(this),
      };
      this.filterInstance.registerFilterOptions(options);
    }

    this.updateLightboxData();
  }

  public updateLightboxData() {
    if (!this.mediaItemsContainer) throw new Error('Media items was not found');

    this.lightboxData = this.mediaItemsContainer.dataset.lightbox
      ? JSON.parse(this.mediaItemsContainer.dataset.lightbox)
      : undefined;
  }

  private setPaginationUrlParams(paginationData?: paginationData) {
    return !paginationData
      ? `offset=0&limit=${this.paginationLimit}&`
      : `offset=${paginationData.offset}&limit=${this.paginationLimit}&`;
  }

  public updateMediaCardContent(paginationData?: object): void {
    if (!paginationData) {
      this.activeIndex = 0;
      this.handlePaginationControlsState();
    }
    this.pageElementsUpdated = true;
    this.mediaCardContents = this.getElements('[data-media-content]');
    this.paginationItems = this.getElements('[data-component="o57-pagination-item"]');
    if (this.mediaCardContents.length < 1) {
      this.warningMessage?.classList.remove(StateClassNames.HIDDEN);
    } else {
      this.warningMessage?.classList.add(StateClassNames.HIDDEN);
    }
    this.mediaCheckboxes = this.getElements('[data-media-checkbox]') as Array<HTMLInputElement>;
    this.mediaCheckboxLabels = this.getElements(
      '[data-media-checkbox-label]',
    ) as Array<HTMLInputElement>;
    this.labelsData =
      this.element.dataset.checkboxLabels && JSON.parse(this.element.dataset.checkboxLabels);
    this.mediaCheckboxLabels.forEach((label, index) => {
      label.innerHTML = this.labelsData.select;
      label.setAttribute('for', `media-${index}`);
    });
    this.mediaCheckboxes.forEach((item, index) => {
      item.setAttribute('id', `media-${index}`);
    });
    this.addEventListeners(this.pageElementsUpdated);

    TweenMax.delayedCall(0.2, () =>
      TweenMax.to(window, 0.6, {
        scrollTo: this.element,
      }),
    );
  }

  private addEventListeners(pageElementsUpdated?: boolean): void {
    // this.mediaCardContents.forEach((card, index) => {
    //   this.addDisposableEventListener(card, 'click', () => this.openLightbox(index));
    // });
    this.mediaCheckboxes.forEach((checkbox, index) => {
      this.addDisposableEventListener(checkbox, 'click', () =>
        this.onCheckboxChecked(checkbox, index),
      );
    });
    this.paginationItems.forEach((item, index) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.activeIndex = index;
        updateClassForItems({
          removeFrom: this.paginationItems,
          addToOne: this.paginationItems[index],
          className: StateClassNames.ACTIVE,
        });

        this.onPaginationClick(index);
      });
    });
    if (!pageElementsUpdated) {
      this.paginationNext?.addEventListener('click', () => {
        this.activeIndex += 1;
        updateClassForItems({
          removeFrom: this.paginationItems,
          addToOne: this.paginationItems[this.activeIndex],
          className: StateClassNames.ACTIVE,
        });
        this.onPaginationClick(this.activeIndex);
      });
      this.paginationPrevious?.addEventListener('click', () => {
        this.activeIndex -= 1;
        updateClassForItems({
          removeFrom: this.paginationItems,
          addToOne: this.paginationItems[this.activeIndex],
          className: StateClassNames.ACTIVE,
        });
        this.onPaginationClick(this.activeIndex);
      });
    }
  }

  private onPaginationClick(index: number): void {
    const { offset } = JSON.parse(<string>this.paginationItems[index].dataset.pagination);
    const paginationData = {
      offset: offset.toString(),
      limit: this.paginationLimit ? this.paginationLimit : 'unlimited',
    };
    if (this.filterInstance) {
      this.filterInstance.handleFilterSubmit(paginationData);
    }
    this.handlePaginationControlsState();
  }

  private handlePaginationControlsState(): void {
    const { activeIndex, paginationItems, paginationNext, paginationPrevious } = this;
    controlsStateToggle(activeIndex, paginationItems.length, paginationNext, paginationPrevious);
  }

  private updateComponent({ response, devUrl, paginationData }: FilteredData) {
    if ('content' in response.data) {
      const updatedItemListData = response.data.content.items;
      const content = response.data.content;
      const updatedListElements: Array<HTMLElement> = [];
      const updatedPaginationItems: Array<HTMLElement> = [];
      const paginationContainer = this.getElement('[data-pagination-container]');

      if (this.mediaItemsContainer && this.listElementClassName) {
        renderFilteredItems(
          updatedItemListData,
          this.isAemEnvironment,
          this.listElementClassName,
          updatedListElements,
          this.mediaItemsContainer,
          devUrl,
        );

        if (this.paginationList) {
          renderUpdatedPagination(
            null,
            paginationContainer,
            this.paginationList,
            updatedPaginationItems,
          );
          emptyAllChildNodes(this.paginationList);
          updatedPaginationItems.forEach((item) => this.paginationList!.appendChild(item));
        }

        emptyAllChildNodes(this.mediaItemsContainer);
        updatedListElements.forEach((item) => this.mediaItemsContainer!.appendChild(item));

        this.updateMediaItemsContainerDataset(content);
        this.updateMediaCardContent(paginationData);
      }
    }
  }

  public updateMediaItemsContainerDataset(content: { items: O40LightboxItemProps[] }) {
    this.mediaItemsContainer?.setAttribute('data-lightbox', JSON.stringify(content));
    this.updateLightboxData();
  }

  public async sendApiCall(mediaArray: Array<string>): Promise<void> {
    const { apiUrl } = this.element.dataset;

    const postData = {
      assets: mediaArray,
    };

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await post(apiUrl, JSON.stringify(postData), requestOptions);
      const blob = await response.blob();
      saveAs(blob, 'NEOM_assets.zip');

      if (this.eventTrackingData) {
        postData.assets.forEach((downloadItem) => {
          TrackingEvent({
            ...this.eventTrackingData,
            eventLabel: `${this.eventTrackingData.eventCategory} - ${downloadItem}`,
          });
        });
      }
    } catch (err) {
      const error = err as string;
      console.log(error);
    }
  }

  private async openLightbox(index: number): Promise<void> {
    if (this.app === null) throw new Error('App was not found');
    if (!this.lightboxData) throw new Error('Lightbox data was not found');

    if (this.lightboxData) {
      const data = { content: this.lightboxData, index };

      const [template, overlay] = await Promise.all([lazyO39Template(), this.app.overlay]);

      await overlay.dispatchAction({
        type: LIGHTBOX.STANDARD_DYNAMIC,
        payload: {
          template: template.default,
          data,
        },
      });
    }
  }

  private onCheckboxChecked(checkbox: HTMLInputElement, index: number): void {
    if (this.app === null) throw new Error('App was not found');
    if (!this.lightboxData) throw new Error('Lightbox data was not found');

    this.updateCheckboxLabel(checkbox, index);

    const popupCopy = this.lightboxData.termsOfUse;
    const downloadHref = this.lightboxData.items[index].link.href;

    checkbox.checked
      ? this.app.sendDownloadData(downloadHref, true, popupCopy)
      : this.app.sendDownloadData(downloadHref, false);
  }

  private updateCheckboxLabel(checkbox: HTMLInputElement, index: number): void {
    checkbox.checked
      ? (this.mediaCheckboxLabels[index].innerHTML = this.labelsData.selected)
      : (this.mediaCheckboxLabels[index].innerHTML = this.labelsData.select);
  }

  public clearCheckboxes(): void {
    this.mediaCheckboxes.forEach((checkbox, index) => {
      checkbox.checked = false;
      this.updateCheckboxLabel(checkbox, index);
    });
  }
}
