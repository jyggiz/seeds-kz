import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import S02FooterTransitionController from './S02FooterTransitionController';
import M14ToggleButton from '../../molecule/m14-toggle-button/M14ToggleButton';
import { TweenLite, TweenMax } from 'gsap';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import A03Heading from '../../atom/a03-heading/A03Heading';

export default class S02Footer extends AbstractTransitionBlock {
  public static displayName: string = 's02-footer';
  public transitionController: S02FooterTransitionController;

  private readonly footerLinks = this.getElements('[data-footer-links]');
  private readonly sitemapItemsHeadings = this.getElements(
    `[data-component="${A03Heading.displayName}"]`,
  );
  private readonly sitemapItems = this.getElements('[data-sitemap-item]');
  private readonly toggleButtons = this.getElements(
    `[data-component="${M14ToggleButton.displayName}"]`,
  );
  private isLarge: boolean = false;

  constructor(el: HTMLElement) {
    super(el);
    this.transitionController = new S02FooterTransitionController(this);

    this.handleDeviceStateChange(deviceStateTracker.currentDeviceState);
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.handleDeviceStateChange(event.data),
    );

    this.toggleButtons.forEach((button, index) => {
      this.addDisposableEventListener(button, 'click', () => {
        this.onToggleClick(index);
      });
    });
  }

  private onToggleClick(index: number) {
    const collapsibleContent = this.footerLinks[index];
    const sitemapItem = this.sitemapItems[index];
    const { maxHeight } = collapsibleContent.style;

    sitemapItem.classList.toggle(StateClassNames.EXPANDED);

    if (maxHeight !== '0px' && maxHeight !== '') {
      TweenMax.set(collapsibleContent, { maxHeight: 0 });
    } else {
      TweenMax.set(collapsibleContent, { maxHeight: `${collapsibleContent.scrollHeight}px` });
    }
  }

  private handleDeviceStateChange({ state }: IDeviceStateData): void {
    this.isLarge = state >= mq.deviceState.LARGE;

    if (this.isLarge) {
      this.footerLinks.forEach((link) => TweenLite.set(link, { clearProps: 'max-height' }));
      this.sitemapItems.forEach((sitemapItem) =>
        sitemapItem.classList.remove(StateClassNames.EXPANDED),
      );
    }

    this.toggleButtons.forEach((button) => {
      button.style.display = this.isLarge ? 'none' : 'flex';
    });

    this.sitemapItemsHeadings.forEach((heading) => {
      heading.style.display = this.isLarge ? 'block' : 'none';
    });
  }
}
