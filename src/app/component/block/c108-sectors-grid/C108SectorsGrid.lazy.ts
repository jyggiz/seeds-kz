import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C108SectorsGridTransitionController from './C108SectorsGridTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import M48SliderPagination from '../../molecule/m48-slider-pagination/M48SliderPagination';
import { StateClassNames } from '../../../data/enum/StateClassNames';

import './c108-sectors-grid.scss';

export default class C108SectorsGrid extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c108-sectors-grid';

  public readonly transitionController: C108SectorsGridTransitionController;

  private readonly tabs = this.getElements(
    `[data-component="${M48SliderPagination.displayName}"] [data-pagination-bar]`,
  );
  private tabsContents = this.getElements('[data-tab]');

  private currentActiveTabIndex = 0;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C108SectorsGridTransitionController(this);

    this.tabs[this.currentActiveTabIndex]?.classList.add(StateClassNames.ACTIVE);
    this.tabsContents[this.currentActiveTabIndex]?.classList.add(StateClassNames.ACTIVE);

    this.addEventListeners();
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private addEventListeners(): void {
    this.tabs.forEach((tab, index) => {
      this.addDisposableEventListener(tab, 'click', () => this.activateContent(index));
    });
  }

  private activateContent(index: number) {
    if (index === this.currentActiveTabIndex) return;

    this.tabs[index].classList.add(StateClassNames.ACTIVE);
    this.tabs[this.currentActiveTabIndex].classList.remove(StateClassNames.ACTIVE);

    this.tabsContents[index]?.classList.add(StateClassNames.ACTIVE);
    this.tabsContents[this.currentActiveTabIndex]?.classList.remove(StateClassNames.ACTIVE);

    this.currentActiveTabIndex = index;
  }
}
