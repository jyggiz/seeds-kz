import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C117FlipCardsTransitionController from './C117FlipCardsTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import deviceStateTracker from '../../../util/deviceStateTracker';
import mq from '../../../data/shared-variable/media-queries.json';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { TweenMax } from 'gsap';
import eases from '../../../animation/eases';
import M02Button from '../../molecule/m02-button/M02Button';

import './c117-flip-cards.scss';

export default class C117FlipCards extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c117-flip-cards';

  public readonly transitionController: C117FlipCardsTransitionController;
  private readonly flipCards = this.getElements('[data-flip]');
  private readonly flipCardsCloseButtons = this.getElements(
    `[data-flip] [data-component="${M02Button.displayName}"]`,
  );
  private readonly cards = this.getElements('[data-card]');
  private readonly hiddenItems = this.getElements('[data-item].-isHidden');
  private readonly loadMoreButton = this.getElement('[data-load-more-button]');
  private readonly links = this.getElements('a');

  private isMobile: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C117FlipCardsTransitionController(this);
    this.addEventListeners();
    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);
  }

  private addEventListeners() {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.cards.forEach((card, index) => {
      this.addDisposableEventListener(card, 'click', () => {
        this.flipCards[index].classList.remove(StateClassNames.HIDDEN);
        this.cards[index].classList.add(StateClassNames.HIDDEN);
        this.flipTheCard(index, true);
      });
    });

    let down = 0;
    let up = 0;
    const threshold = 200;

    this.flipCards.forEach((flip, index) => {
      this.addDisposableEventListener(flip, 'mousedown', () => {
        down = +new Date();
      });

      this.addDisposableEventListener(flip, 'mouseup', () => {
        up = +new Date();

        if (up - down < threshold && !this.isMobile) {
          this.hideFlipCards(index);
        }
      });
    });

    this.flipCardsCloseButtons.forEach((flip, index) => {
      this.addDisposableEventListener(flip, 'click', () => {
        if (this.isMobile) {
          this.hideFlipCards(index);
        }
      });
    });

    this.links.forEach((link) => {
      this.addDisposableEventListener(link, 'mouseup', (event: Event) => {
        event.stopPropagation();
      });
    });

    if (this.loadMoreButton) {
      this.addDisposableEventListener(this.loadMoreButton, 'click', this.loadMoreItems.bind(this));
    }
  }

  private hideFlipCards(index: number) {
    this.flipTheCard(index, false);
    this.cards[index].classList.remove(StateClassNames.HIDDEN);
  }

  private async onDeviceStateChange({ state }: IDeviceStateData): Promise<void> {
    this.isMobile = state <= mq.deviceState.MEDIUM;
  }

  private loadMoreItems() {
    TweenMax.to(this.hiddenItems, 2, {
      opacity: 1,
      display: 'block',
    });

    this.loadMoreButton?.classList.add(StateClassNames.HIDDEN);
  }

  private flipTheCard(index: number, isHidden: boolean) {
    if (isHidden) {
      TweenMax.set(this.flipCards[index], { x: '0%', y: '0%', scale: 1 });

      TweenMax.fromTo(
        this.flipCards[index],
        0.5,
        {
          y: 100,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
        },
      );
    } else {
      TweenMax.fromTo(
        this.flipCards[index],
        0.7,
        {
          y: 0,
          autoAlpha: 1,
        },
        {
          y: '45%',
          x: '-45%',
          scale: 0.1,
          autoAlpha: 0,
          ease: eases.VinnieInOut,
        },
      );
    }
  }

  public adopted() {
    setAsInitialised(this.element);
  }
}
