import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import App from 'app/component/layout/app/App';
import { StateClassNames } from 'app/data/enum/StateClassNames';
import { getAppComponent } from 'app/util/getElementComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { updateClassForItems } from 'app/util/stateClassNamesToggle';
import { getComponentForElement } from 'muban-core';
import C60TabsTransitionController from './C60TabsTransitionController';

import './c60-tabs.scss';

export default class C60Tabs extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c60-tabs';
  public readonly transitionController: C60TabsTransitionController;
  private readonly tabItems = this.getElements('[data-tab-item]');
  private readonly tabContent = this.getElements('[data-tab-content]');

  private readonly contentContainer = this.getElements('[data-tab-content-container]');
  private app!: App;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C60TabsTransitionController(this);
    this.tabItems[0].classList.add(StateClassNames.ACTIVE);
    this.tabContent[0].classList.add(StateClassNames.OPEN);

    const element = this.contentContainer[0].firstElementChild as HTMLElement;
    if (element) {
      const component = getComponentForElement<AbstractTransitionComponent>(element);
      component.transitionIn(true);
    }

    this.addEventListener();
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.app = await getAppComponent();
  }

  private addEventListener(): void {
    this.tabItems.forEach((item: HTMLElement, index: number) => {
      this.addDisposableEventListener(item, 'click', () => this.handleTabClick(item, index));
    });
  }

  private handleTabClick(item: HTMLElement, index: number) {
    if (item.classList.contains(StateClassNames.ACTIVE)) return;

    updateClassForItems({
      removeFrom: this.tabItems,
      addToOne: this.tabItems[index],
      className: StateClassNames.ACTIVE,
    });

    updateClassForItems({
      removeFrom: this.tabContent,
      addToOne: this.tabContent[index],
      className: StateClassNames.OPEN,
    });

    this.handleComponentAnimation(index);
  }

  private handleComponentAnimation(index: number) {
    this.contentContainer.forEach((content, contentIndex) => {
      const element = content.firstElementChild as HTMLElement;
      if (element) {
        const component = getComponentForElement<AbstractTransitionComponent>(element);
        if (contentIndex === index) {
          component.transitionIn(true);
        } else {
          component.transitionOut();
        }
      }
    });
  }
}
