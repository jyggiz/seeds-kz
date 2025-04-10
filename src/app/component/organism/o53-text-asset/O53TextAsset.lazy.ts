import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O53TextAssetTransitionController from './O53TextAssetTransitionController';

import './o53-text-asset.scss';
export default class O53TextAsset extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o53-text-asset';

  public readonly transitionController: O53TextAssetTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O53TextAssetTransitionController(this);
  }
}
