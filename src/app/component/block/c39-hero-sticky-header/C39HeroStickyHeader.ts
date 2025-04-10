import A02Icon from 'app/component/atom/a02-icon/A02Icon';
import A03Heading from 'app/component/atom/a03-heading/A03Heading';
import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import M18Paragraph from 'app/component/molecule/m18-paragraph/M18Paragraph';
import { TweenMax } from 'gsap';
import C39HeroStickyHeaderTransitionController from './C39HeroStickyHeaderTransitionController';
import lerp from 'lerp';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';

export default class C39HeroStickyHeader extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c39-hero-sticky-header';

  public readonly transitionController: C39HeroStickyHeaderTransitionController;

  private topHeadingElm = this.getElement('[data-hero-heading]');
  private topHeadingWrapperElement = this.getElement('[data-hero-heading-wrapper]');
  private bottomHeadingElement = this.getElement(
    `[data-content-wrapper] [data-component="${A03Heading.displayName}"]`,
  );
  private bottomHeadingWrapperElm = this.getElement(
    '[data-content-wrapper] [data-paragraph-heading]',
  );
  private paragraph = <HTMLElement>(
    this.getElement(`[data-component="${M18Paragraph.displayName}"]`)
  );
  private paragraphIcon = this.getElement(
    `[data-component="${A02Icon.displayName}"]`,
    this.paragraph,
  );
  private topHeading = this.getElement(`[data-component="${A03Heading.displayName}"]`);
  private paragraphContent = this.getElement(`[data-paragraph-content]`);
  private offsetHeight = this.bottomHeadingElement?.offsetHeight;
  private yPosition = scrollY;
  private isStaticFontSize: boolean = this.element.hasAttribute('data-static-font-size');

  private animationFrameReference = 0;

  private isMobile = deviceStateTracker.currentDeviceState.state < 2;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C39HeroStickyHeaderTransitionController(this);
  }

  public async adopted(): Promise<void> {
    this.transitionController.setupParagraphTimeline(this);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.tick();
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state < mq.deviceState.MEDIUM;
  }

  private tick(): void {
    this.offsetHeight = this.bottomHeadingElement?.offsetHeight;
    if (
      this.topHeadingElm &&
      this.bottomHeadingWrapperElm &&
      this.topHeadingWrapperElement &&
      this.bottomHeadingElement &&
      this.paragraphIcon &&
      this.offsetHeight
    ) {
      this.yPosition = lerp(this.yPosition, scrollY, 0.75);

      const topHeadingTop = this.topHeadingElm.getBoundingClientRect().top;
      const topHeadingWrapperTop = this.topHeadingWrapperElement.getBoundingClientRect().top;
      const bottomHeadingTop = this.bottomHeadingWrapperElm.getBoundingClientRect().top;
      const bottomHeadingNewTop = -bottomHeadingTop + (topHeadingWrapperTop + this.yPosition);
      const scalingBigHeading = Math.max(0.5, Math.min(1.0 - this.yPosition / 2000));
      const scalingSmallHeading = Math.max(0.7, Math.min(1.0 - this.yPosition / 3000));
      const negativeBigMargin = (this.offsetHeight - this.offsetHeight * 0.5) / 2;
      const negativeSmallMargin = (this.offsetHeight - this.offsetHeight * 0.7) / 2;
      const negativeXSmallMargin = (this.offsetHeight - this.offsetHeight * 0.9) / 2;

      if (bottomHeadingTop > topHeadingTop) {
        if (this.bottomHeadingElement.classList.contains('-h2' || '-h1')) {
          TweenMax.set(this.bottomHeadingElement, {
            y: bottomHeadingNewTop,
            scale: this.isStaticFontSize ? 1 : scalingBigHeading,
          });
          TweenMax.set(this.paragraphIcon, {
            marginBottom: -negativeBigMargin,
          });
          if (this.paragraphContent)
            TweenMax.set(this.paragraphContent, {
              marginTop: -negativeXSmallMargin,
            });
        } else {
          TweenMax.set(this.bottomHeadingElement, {
            y: bottomHeadingNewTop,
            scale: this.isStaticFontSize ? 1 : scalingSmallHeading,
          });
          TweenMax.set(this.paragraphIcon, {
            marginBottom: -negativeSmallMargin,
          });
          if (this.paragraphContent)
            TweenMax.set(this.paragraphContent, {
              marginTop: -negativeXSmallMargin,
            });
        }
        this.paragraphIcon &&
          TweenMax.to(this.paragraphIcon, 0.5, {
            autoAlpha: 0,
            opacity: 0,
          });
      } else {
        TweenMax.set(this.bottomHeadingElement, {
          y: 0,
          scale: this.isStaticFontSize ? 1 : this.isMobile ? 0.65 : 0.5,
        });

        this.transitionController.paragraphTransitionIn();
        this.paragraphIcon &&
          TweenMax.to(this.paragraphIcon, 0.5, {
            autoAlpha: 1,
          });
      }
      this.topHeadingElm.style.transform = `translateY(${this.yPosition}px)`;

      if (!this.isStaticFontSize) {
        if (this.bottomHeadingElement.classList.contains('-h2' || '-h1')) {
          if (this.topHeading) this.topHeading.style.transform = `scale(${scalingBigHeading})`;
        } else {
          if (this.topHeading) this.topHeading.style.transform = `scale(${scalingSmallHeading})`;
        }
      }
    }

    this.animationFrameReference = requestAnimationFrame(this.tick.bind(this));
  }

  public dispose() {
    super.dispose();

    cancelAnimationFrame(this.animationFrameReference);
  }
}
