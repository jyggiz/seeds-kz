import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import trackEvent, { TrackingEventNames } from 'app/util/TrackingEvent';
import S05AnchorLinkButtonTransitionController from './S05AnchorLinkButtonTransitionController';
import S02Footer from '../s02-footer/S02Footer';
import { getDisplayNameWithoutId } from '../../../util/getDisplayNameWithoutId';
import { TweenMax } from 'gsap';
import { debounce } from 'lodash-es';

export default class S05AnchorLinkButton extends AbstractTransitionComponent {
  public static readonly displayName: string = 's05-anchor-link-button';

  private readonly anchorLinkContainer = this.getElement<HTMLElement>(
    `[data-anchor-link-container]`,
  );

  public readonly footer = this.getElement(
    `[data-component="${S02Footer.displayName}"]`,
    document.body,
  );

  public readonly transitionController: S05AnchorLinkButtonTransitionController;

  private isVisible: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new S05AnchorLinkButtonTransitionController(this);

    this.addDisposableEventListener(
      window,
      'scroll',
      debounce(this.updateAnchorLinkVisibility.bind(this), 100),
    );
  }

  public adopted() {
    this.updateAnchorLinkVisibility();
    this.onCTAClick();
  }

  public updateAnchorLinkVisibility(): void {
    const scrollY = window.scrollY + window.innerHeight;

    const footerOffsetHeight = this.footer?.offsetHeight || 0;

    const scrollLimit = document.body.scrollHeight - footerOffsetHeight;

    const anchorAppearanceScrollHeight = 120;

    const isScrollLimitPassed =
      scrollY >= scrollLimit || scrollY <= window.innerHeight + anchorAppearanceScrollHeight;

    this.setAnchorLinkVisibility(!isScrollLimitPassed);
  }

  public setAnchorLinkVisibility(visible: boolean) {
    if (this.isVisible === visible) {
      return;
    }

    if (!this.anchorLinkContainer) {
      throw new Error('Element with [data-anchor-link-container] not found');
    }

    TweenMax.to(this.anchorLinkContainer, 0.3, {
      autoAlpha: visible ? 1 : 0,
      display: visible ? 'inline-flex' : 'none',
    });

    this.isVisible = visible;
  }

  private onCTAClick() {
    this.addDisposableEventListener(this.element, 'click', this.trackCTA.bind(this));
  }

  private trackCTA(): void {
    trackEvent({
      event: TrackingEventNames.CLICK,
      aem_component_id: this.displayName,
      aem_component_name: getDisplayNameWithoutId(this.displayName),
      clickText: this.element.innerText,
    });
  }
}
