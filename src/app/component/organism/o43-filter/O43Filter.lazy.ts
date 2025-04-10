import { renderItems } from 'muban-core/lib/utils/dataUtils';
import { updateClassForItems } from '../../../util/stateClassNamesToggle';
import {
  updateActiveIndicator,
  setInitialActiveIndicator,
} from '../../../util/activeIndicatorSwitcher';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O43FilterTransitionController from './O43FilterTransitionController';
import O44FilterOptionList from '../o44-filter-option-list/O44FilterOptionList.lazy';
import O56ButtonTemplate from 'app/component/organism/o56-filter-button-item/o56-filter-button-item.hbs?include';
import { FilteredData } from './O43Filter.types';
import get from 'app/util/fetch/getRequest';
import { C46MediaListFilteredData } from 'app/component/block/c46-media-list/C46MediaList.types';
import M50SearchField from 'app/component/molecule/m50-search-field/M50SearchField';
import { IEvent } from 'seng-event';
import debounce from 'lodash-es/debounce';
import MockData from './seedMock.json';

import './o43-filter.scss';
import O40LightboxItemProps from "../o40-lightbox-item/O40LightboxItem.types";

export type paginationData = {
  limit: string;
  offset: string;
};

export interface FilterOptions {
  updateParentComponent: (filteredData: FilteredData) => void;
  setPaginationUrlParams: (paginationData?: paginationData) => string;
  localeUrlParams?: string;
}

export default class O43Filter extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o43-filter';

  public readonly transitionController: O43FilterTransitionController;

  private readonly primaryFilterIndicator = this.getElement('[data-primary-filter-indicator]');
  private readonly primaryFilterItems = this.getElements('[data-primary-item]');
  private readonly activePrimaryFilter = this.primaryFilterItems.find((item) =>
    item.classList.contains(StateClassNames.ACTIVE),
  );
  private readonly secondaryFilterItems = this.getElements('[data-secondary-item]');
  private readonly filterCategoryLists = this.getElements(
    `[data-component="${O44FilterOptionList.displayName}"]`,
  );
  private readonly filterCategoryOptions = this.getElements('[data-option-item]');
  private submitButtons: readonly HTMLElement[] | null = this.getElements('[data-submit-button]');
  private clearButtons: readonly HTMLElement[] | null = this.getElements('[data-clear-button]');
  private readonly selectedFiltersContainer: HTMLElement | null =
    this.getElement('[data-selected-filters]');
  private selectedFilterButtons: HTMLElement[] | undefined = [];
  private selectedFilterOptions: HTMLElement[] = [];
  private selectedFilterData: Record<string, unknown>[] = [];
  private selectedAssetType: object = {};
  private apiUrlParams: string = '';
  private isAemEnvironment = document && document.getElementsByClassName('root responsivegrid')[0];
  private renderNodesInParent: null | ((data: FilteredData) => void) = null;
  private setPaginationUrlParams: null | ((paginationData?: paginationData) => string) = null;
  private searchField = this.getElement(`[data-component='${M50SearchField.displayName}']`);
  private searchQuery: string | null = null;
  private localeURLParams: string | undefined;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O43FilterTransitionController(this);
    this.activePrimaryFilter &&
      this.primaryFilterIndicator &&
      setInitialActiveIndicator(this.activePrimaryFilter, this.primaryFilterIndicator);
    this.addEventListeners();
  }

  /**
   * The registerFilterOptions function is invoked by the parent component that employs o43 in order to customize the filtering logic
   * depending on the parent needs.
   */
  public registerFilterOptions(filterOptions: FilterOptions) {
    const { updateParentComponent, setPaginationUrlParams, localeUrlParams } = filterOptions;
    this.renderNodesInParent = updateParentComponent;
    this.setPaginationUrlParams = setPaginationUrlParams;
    this.localeURLParams = localeUrlParams;
  }

  private addEventListeners(): void {
    this.primaryFilterItems.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.handlePrimaryFilterItems(item, index);
      });
    });
    this.secondaryFilterItems.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => {
        const itemIndex = !item.classList.contains(StateClassNames.ACTIVE) ? index : null;
        updateClassForItems({
          removeFrom: this.secondaryFilterItems,
          addToOne: itemIndex !== null ? this.secondaryFilterItems[itemIndex] : null,
          className: StateClassNames.ACTIVE,
        });

        updateClassForItems({
          removeFrom: this.filterCategoryLists,
          addToOne: itemIndex !== null ? this.filterCategoryLists[itemIndex] : null,
          className: StateClassNames.OPEN,
        });
      });
    });
    this.element.addEventListener('mouseleave', () => {
      this.hideFiltersDropdown();
    });
    this.filterCategoryOptions.forEach((item: HTMLElement) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.addSelectedFilters(item);
      });
    });

    this.submitButtons &&
      this.submitButtons.forEach((item: HTMLElement) => {
        this.addDisposableEventListener(item, 'click', async () => {
          await this.handleFilterSubmit();
          this.hideFiltersDropdown();
        });
      });
    this.clearButtons &&
      this.clearButtons.forEach((item: HTMLElement) => {
        this.clearAllSelectedFilters(item);
      });

    if (this.searchField) {
      this.addDisposableEventListener(
        this.searchField,
        'input',
        debounce((event: IEvent) => this.onSearchInput(event), 500),
      );
    }
  }

  private hideFiltersDropdown(): void {
    updateClassForItems({
      removeFrom: this.filterCategoryLists,
      className: StateClassNames.OPEN,
    });
    updateClassForItems({
      removeFrom: this.secondaryFilterItems,
      className: StateClassNames.ACTIVE,
    });
  }

  private generateUrlParams(paginationData?: paginationData): void {
    if (!this.setPaginationUrlParams) {
      throw new Error('setPaginationUrlParams has not been registered correctly');
    }
    const paginationUrlParam = this.setPaginationUrlParams(paginationData);
    const assetTypeParams = `${Object.keys(this.selectedAssetType)[0]}=${
      Object.values(this.selectedAssetType)[0]
    }&`;
    this.apiUrlParams =
      Object.values(this.selectedAssetType)[0] && Object.values(this.selectedAssetType)[0] !== 'all'
        ? assetTypeParams + paginationUrlParam
        : paginationUrlParam;

    this.selectedFilterData.map((element: object) => {
      const filterParams = `${Object.keys(element)[0]}=${Object.values(element)[0]}&`;
      this.apiUrlParams += `${filterParams}`;
    });

    if (this.searchQuery) {
      this.apiUrlParams += `query=${this.searchQuery}&`;
    }

    if (this.localeURLParams) {
      this.apiUrlParams += this.localeURLParams;
    }
  }

  private async fetchFilteredData(
    paginationData?: paginationData,
  ): Promise<FilteredData | undefined> {
    const { apiUrl, devUrl } = this.element.dataset;
    const finalUrl = !this.isAemEnvironment ? `${devUrl}${apiUrl}` : apiUrl;

    const rawResponse = await get(`${finalUrl}${this.apiUrlParams}`);
    const response = (await rawResponse.json()) as C46MediaListFilteredData;

    if (response?.status !== 'success') {
      throw new Error(
        `Filtering on server side was not succesful. Response status: ${response?.status}`,
      );
    }
    return response ? { response, devUrl, paginationData } : undefined;
  }

  private clearAllSelectedFilters(item: HTMLElement): void {
    this.addDisposableEventListener(item, 'click', async () => {
      updateClassForItems({
        removeFrom: this.selectedFilterOptions,
        className: StateClassNames.SELECTED,
      });

      this.selectedFilterOptions = [];
      this.selectedFilterData = [];
      this.generateUrlParams();
      this.selectedFiltersContainer && (await this.handleFilterSubmit());
      this.hideFiltersDropdown();
    });
  }

  private addSelectedFilters(item: HTMLElement): void {
    item.classList.toggle(StateClassNames.SELECTED);
    const { category } = item.dataset;
    const { value, label } = item.dataset.option && JSON.parse(item.dataset.option);
    const selectedItemData = {};
    if (category && item.classList.contains(StateClassNames.SELECTED)) {
      Object.assign(selectedItemData, { [category]: value, label: label, value: value });
      this.selectedFilterData.push(selectedItemData);
    } else {
      this.updateSelectedFilterData(item);
    }
    this.selectedFilterOptions = this.filterCategoryOptions.filter((item) =>
      item.classList.contains(StateClassNames.SELECTED),
    );
  }

  private selectAssetType(item: HTMLElement, index: number): void {
    updateClassForItems({
      removeFrom: this.primaryFilterItems,
      addToOne: this.primaryFilterItems[index],
      className: StateClassNames.ACTIVE,
    });

    const { category } = item.dataset;
    const { value, label } = item.dataset.option && JSON.parse(item.dataset.option);
    if (category && item.classList.contains(StateClassNames.ACTIVE)) {
      Object.assign(this.selectedAssetType, { assetType: value, label: label, value: value });
    }
    this.generateUrlParams();
    this.handleFilterSubmit();
  }

  private updateSelectedFilterData(item: HTMLElement): void {
    this.selectedFilterData = this.selectedFilterData?.filter((categoryItem: object) => {
      return Object.values(categoryItem)[0] !== item.dataset.value;
    });
  }

  private removeSelectedFilters(item: HTMLElement): void {
    if (!this.selectedFiltersContainer) return;
    this.selectedFilterOptions.forEach((optionItem) => {
      if (optionItem.dataset.value === item.dataset.value)
        optionItem.classList.remove(StateClassNames.SELECTED);
    });
    this.selectedFilterOptions = this.selectedFilterOptions?.filter((optionItem) => {
      return optionItem.dataset.value !== item.dataset.value;
    });
    this.updateSelectedFilterData(item);
    this.handleFilterSubmit();
  }

  public async fetchMockData(): Promise<FilteredData> {
    const data: FilteredData = {
      response: MockData,
    };

    return new Promise((resolve) => {
      resolve(data);
    });
  }

  public async handleFilterSubmit(paginationData?: paginationData): Promise<void> {
    if (!this.selectedFiltersContainer) return;
    this.generateUrlParams(paginationData);
    let filteredData;
    try {
      filteredData = await this.fetchMockData();
    } catch (err) {
      console.log(err);
    }

    const contentToRender = structuredClone(filteredData);

    if (contentToRender && this.selectedFilterData.length > 0) {
      contentToRender.response.data.content.items
        = contentToRender.response.data.content.items.filter((item: O40LightboxItemProps) => {
          return this.selectedFilterData.some((filter) => filter.value === item.tag);
      })
    }

    if (this.renderNodesInParent && contentToRender) {
      this.renderNodesInParent(contentToRender);
    }

    if (this.selectedFilterData) {
      renderItems(this.selectedFiltersContainer, O56ButtonTemplate, this.selectedFilterData);
    }

    const selectedFilterButtons = Array.from(
      this.selectedFiltersContainer?.querySelectorAll(`[data-active-filter-item]`),
    ) as HTMLElement[];
    this.selectedFilterButtons = selectedFilterButtons;

    this.selectedFilterButtons.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => {
        this.removeSelectedFilters(item);
      });
    });
  }

  private handlePrimaryFilterItems(item: HTMLElement, index: number): void {
    updateClassForItems({
      removeFrom: this.primaryFilterItems,
      className: StateClassNames.ACTIVE,
    });

    this.primaryFilterIndicator &&
      this.primaryFilterItems.length &&
      updateActiveIndicator(this.primaryFilterItems[index], this.primaryFilterIndicator);
    this.selectAssetType(item, index);
    this.generateUrlParams();
  }

  private onSearchInput(event: IEvent) {
    const target: HTMLInputElement = event.target as unknown as HTMLInputElement;

    this.searchQuery = target.value;

    this.handleFilterSubmit();
  }
}
