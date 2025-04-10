import { TweenMax } from 'gsap';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C41NewsroomListTransitionController from './C41NewsroomListTransitionController';
import M02Button from 'app/component/molecule/m02-button/M02Button';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c41-newsroom-list.scss';

export default class C41NewsroomList extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c41-newsroom-list';

  public readonly transitionController: C41NewsroomListTransitionController;

  private initialItemCount: number = 7;
  private itemsPerLoad: number = 6;
  private totalItemsLoaded: number = this.initialItemCount;
  private footer = this.getElement(`[data-footer]`);
  private loadMoreButton = this.getElement(
    `[data-footer] [data-component="${M02Button.displayName}"]`,
  );
  private readonly listItems = this.getElements('[data-list-item]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C41NewsroomListTransitionController(this);

    this.setListItemsVisibility();
    this.loadMoreButton?.addEventListener('click', this.onLoadMoreClick.bind(this));
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private onLoadMoreClick(): void {
    this.totalItemsLoaded += this.itemsPerLoad;
    this.updateListItemsVisibility();
  }

  private setListItemsVisibility(): void {
    this.listItems.forEach((item, index) => {
      if (index >= this.totalItemsLoaded) {
        TweenMax.set(item, {
          display: 'none',
          autoAlpha: 0,
        });
      }
    });
  }

  private updateListItemsVisibility(): void {
    this.listItems.forEach((item, index) => {
      if (index < this.totalItemsLoaded) {
        TweenMax.to(item, 1.5, {
          display: 'block',
          autoAlpha: 1,
        });
      }
    });

    const isListEnded = this.totalItemsLoaded >= this.listItems.length;
    if (isListEnded) this.footer?.classList.add(StateClassNames.HIDDEN);
  }
}
