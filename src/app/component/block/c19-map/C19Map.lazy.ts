import { getComponentForElement } from 'muban-core';
import debounce from 'lodash-es/debounce';
import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import A20LottieAnimation from '../../atom/a20-lottie-animation/A20LottieAnimation.lazy';
import { TransitionEvent } from 'transition-controller';
import C19MapTransitionController from './C19MapTransitionController';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { setAsInitialised } from 'app/util/setAsInitialised';

import './c19-map.scss';

export default class C19Map extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c19-map';

  public readonly transitionController: C19MapTransitionController;

  private readonly desktopLottie: A20LottieAnimation | null = null;
  private readonly mobileLottie: A20LottieAnimation | null = null;

  private _loading = false;

  constructor(el: HTMLElement) {
    super(el);

    this.loading = true;

    this.transitionController = new C19MapTransitionController(this);

    const desktopLottieWrapper = this.getElement(
      `[data-desktop] > [data-component="${A20LottieAnimation.displayName}"]`,
    );
    if (desktopLottieWrapper) {
      this.desktopLottie = getComponentForElement<A20LottieAnimation>(desktopLottieWrapper);
    }

    const mobileLottieWrapper = this.getElement(
      `[data-mobile] > [data-component="${A20LottieAnimation.displayName}"]`,
    );
    if (mobileLottieWrapper) {
      this.mobileLottie = getComponentForElement<A20LottieAnimation>(mobileLottieWrapper);
    }

    this.addEventListeners();
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(
      this.transitionController,
      TransitionEvent.TRANSITION_IN_COMPLETE,
      this.play.bind(this),
    );

    this.addDisposableEventListener(window, 'resize', debounce(this.play.bind(this), 300));
  }

  private set loading(value: boolean) {
    this._loading = value;
    this.element.classList[value ? 'add' : 'remove'](StateClassNames.LOADING);
  }

  private static get isMobile(): boolean {
    return deviceStateTracker.currentDeviceState.state <= 2;
  }

  private async play(): Promise<void> {
    this.loading = true;
    C19Map.isMobile ? await this.mobileLottie?.play() : await this.desktopLottie?.play();
    this.loading = false;
  }
}
