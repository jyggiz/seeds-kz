import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C29StoriesTransitionController from './C29StoriesTransitionController';
import O12RichQuote from 'app/component/organism/o12-rich-quote/O12RichQuote.lazy';

import './c29-stories.scss';

export default class C29Stories extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c29-stories';

  public readonly transitionController: C29StoriesTransitionController;

  private readonly elements = this.getElements(`[data-component="${O12RichQuote.displayName}"]`);

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C29StoriesTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
