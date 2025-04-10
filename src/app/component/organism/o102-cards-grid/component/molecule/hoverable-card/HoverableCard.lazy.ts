import { setAsInitialised } from '../../../../../../util/setAsInitialised';
import AbstractComponent from '../../../../../AbstractComponent';
import { TimelineMax } from 'gsap';
import deviceStateTracker from 'app/util/deviceStateTracker';
import mq from '../../../../../../data/shared-variable/media-queries.json';

import './hoverable-card.scss';

export default class HoverableCard extends AbstractComponent {
  public static readonly displayName: string = 'm-hoverable-card';
  private readonly _label = this.getElement('[data-label]');
  private readonly _description = this.getElement('[data-description]');
  private readonly _icon = this.getElement('[data-icon]');
  private timeline = new TimelineMax();
  private isMobile = deviceStateTracker.currentDeviceState.state < mq.deviceState.MEDIUM;

  constructor(el: HTMLElement) {
    super(el);
  }

  get label() {
    if (!this._label) {
      throw new Error('Could not find [data-label]');
    }
    return this._label;
  }

  get description() {
    if (!this._description) {
      throw new Error('Could not find [data-description]');
    }
    return this._description;
  }

  get icon() {
    if (!this._icon) {
      throw new Error('Could not find [data-icon]');
    }
    return this._icon;
  }

  private activate() {
    if (this.timeline.totalProgress() === 1) {
      return;
    }
    this.timeline.play();
  }

  private deactivate() {
    if (this.timeline.totalProgress() === 0) {
      return;
    }
    this.timeline.reverse();
  }

  private activateThroughDeepLink() {
    const id = window.location.hash.replace('#', '');
    if (id !== '' && this.element.id === id) {
      this.activate();
    }
  }

  public adopted() {
    setAsInitialised(this.element);

    this.timeline
      .to(
        this.label,
        0.4,
        {
          x: -1 * (this.label.offsetLeft - 30),
          y: -1 * (this.label.offsetTop - 32),
        },
        0,
      )
      .to(
        this.description,
        0.6,
        {
          opacity: 1,
          y: this.label.clientHeight + 16 + 30,
          x: 30,
          visibility: 'visible',
        },
        0,
      )
      .to(
        this.icon,
        0.8,
        {
          opacity: 1,
          x: 90,
        },
        0,
      )
      .pause();

    if (this.isMobile) {
      this.activate();
    }

    this.addEventListeners();
    this.activateThroughDeepLink();
  }

  private addEventListeners() {
    this.addDisposableEventListener(this.element, 'mouseenter', () => {
      this.activate();
    });
    this.addDisposableEventListener(this.element, 'mouseleave', () => {
      this.deactivate();
    });
  }
}
