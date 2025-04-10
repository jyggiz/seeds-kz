import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C08HighlightsTransitionController from './C08HighlightsTransitionController';

import './c08-highlights.scss';

export default class C08Highlights extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c08-highlights';

  public readonly transitionController: C08HighlightsTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C08HighlightsTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
