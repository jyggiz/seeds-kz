import lerp from 'lerp';
import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C47MotionBannerTransitionController from './C47MotionBannerTransitionController';
import { TweenMax } from 'gsap';
import type ImageEffect from '../../../effects/ImageEffect';
import { clamp } from '../../../util/clamp';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { toggleInert } from '../../../util/toggleInert';

import './c47-motion-banner.scss';

export default class C47MotionBanner extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c47-motion-banner';

  public readonly transitionController: C47MotionBannerTransitionController;

  private assetWrapper = this.getElement<HTMLDivElement>('[data-asset-wrapper]');
  private assets = this.getElements('[data-asset]');
  private backgroundContainer = this.getElement('[data-background]');

  private effect: ImageEffect | null = null;

  private animationFrameReference = 0;

  private interpolatedValues = {
    assetWrapperPosition: 0,
    mousePosition: {
      x: 0,
      y: 0,
    },
  };

  private mousePosition = {
    x: 0,
    y: 0,
  };

  private randomAssetValues = this.assets.map(() => Math.random());

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C47MotionBannerTransitionController(this);
  }

  public async adopted(): Promise<void> {
    setAsInitialised(this.element);
    this.tick();

    if (this.backgroundContainer) {
      toggleInert(this.backgroundContainer, true);
    }

    this.addDisposableEventListener(window, 'mousemove', (event: MouseEvent) => {
      this.mousePosition = {
        x: event.clientX - window.innerWidth / 2,
        y: event.clientY - window.innerHeight / 2,
      };
    });
  }

  private tick(): void {
    const scrollPosition = window.scrollY;
    const offset = this.element.offsetTop;
    const elementHeight = this.element.clientHeight;
    const windowHeight = window.innerHeight;
    const modifier = this.assets[0].clientHeight + 200;
    const assetWrapperWidth =
      this.assets.map((asset) => asset.clientWidth).reduce((partialSum, a) => partialSum + a, 0) ??
      0;

    const min = offset - windowHeight;
    const max = offset + elementHeight;

    const isInView = Boolean(Number(min < scrollPosition) ^ Number(max <= scrollPosition));

    if (isInView) {
      if (assetWrapperWidth > window.innerWidth) {
        const progress = clamp(
          (scrollPosition - offset + (windowHeight - elementHeight)) /
            (elementHeight - modifier + (windowHeight - elementHeight)),
          0,
          1,
        );

        this.interpolatedValues.assetWrapperPosition = lerp(
          this.interpolatedValues.assetWrapperPosition,
          progress * (assetWrapperWidth - window.innerWidth) * -1,
          0.15,
        );

        if (this.assetWrapper)
          TweenMax.set(this.assetWrapper, {
            x: this.interpolatedValues.assetWrapperPosition,
          });
      }

      if (window.matchMedia('(pointer: fine)').matches) {
        if (this.assetWrapper)
          TweenMax.set(this.assetWrapper, {
            clearProps: 'x',
          });

        this.interpolatedValues.mousePosition.x = lerp(
          this.interpolatedValues.mousePosition.x,
          this.mousePosition.x,
          0.05,
        );
        this.interpolatedValues.mousePosition.y = lerp(
          this.interpolatedValues.mousePosition.y,
          this.mousePosition.y,
          0.05,
        );

        this.assets.forEach((asset, index) => {
          const modifier = this.randomAssetValues[index] * 15 + 15;

          TweenMax.set(asset, {
            x: this.interpolatedValues.mousePosition.x / modifier,
            y: this.interpolatedValues.mousePosition.y / modifier,
          });
        });
      }
    } else {
      if (this.assetWrapper)
        TweenMax.set(this.assetWrapper, {
          clearProps: 'x',
        });

      this.assets.forEach((asset) => {
        TweenMax.set(asset, {
          x: 0,
          y: 0,
        });
      });
    }

    this.animationFrameReference = requestAnimationFrame(() => this.tick());
  }

  public dispose() {
    super.dispose();
    cancelAnimationFrame(this.animationFrameReference);
    this.effect?.dispose();
  }
}
