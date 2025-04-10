import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C78SocialMediaTeaserBarTransitionController from './C78SocialMediaTeaserBarTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c78-social-media-teaser-bar.scss';

export default class C78SocialMediaTeaserBar extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c78-social-media-teaser-bar';

  public readonly transitionController: C78SocialMediaTeaserBarTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C78SocialMediaTeaserBarTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
