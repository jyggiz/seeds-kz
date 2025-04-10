import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C112VideoGalleryTransitionController from './C112VideoGalleryTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c112-video-gallery.scss';

export default class C112VideoGallery extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c112-video-gallery';

  public readonly transitionController: C112VideoGalleryTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C112VideoGalleryTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
