import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C40ArticleListTransitionController from './C40ArticleListTransitionController';

import './c40-article-list.scss';

export default class C40ArticleList extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c40-article-list';

  public readonly transitionController: C40ArticleListTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C40ArticleListTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
