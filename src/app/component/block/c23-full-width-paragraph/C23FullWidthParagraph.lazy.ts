import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C23FullWidthParagraphTransitionController from './C23FullWidthParagraphTransitionController';

import './c23-full-width-paragraph.scss';

export default class C23FullWidthParagraph extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c23-full-width-paragraph';

  public readonly transitionController: C23FullWidthParagraphTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C23FullWidthParagraphTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
