import { TimelineMax } from 'gsap';

import AbstractTransitionComponent from '../../AbstractTransitionComponent';
import M47HamburgerMenuTransitionController from './M47HamburgerMenuTransitionController';
import { M47HamburgerMenuEvent } from './M47HamburgerMenu.utils';
import { StateClassNames } from '../../../data/enum/StateClassNames';

export default class M47HamburgerMenu extends AbstractTransitionComponent {
  public static readonly displayName: string = 'm47-hamburger-menu';

  private readonly breadcrumb = this.getElement('[data-breadcrumb]');
  private readonly toggleMenuButton = this.getElement('[data-hamburger-menu]');
  private readonly hamburgerMenuIconLines = this.getElements('rect');

  private readonly menuToggleTimeline: TimelineMax;
  private resetMenuIconTimeout: number | null = null;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new M47HamburgerMenuTransitionController(this);

    if (this.breadcrumb) {
      this.breadcrumb.innerText = document.title.toLocaleUpperCase();
    }

    this.menuToggleTimeline = this.createMenuToggleTimeline();
    this.addEventListeners();
    this.toggleMenuButton?.setAttribute(
      'aria-expanded',
      `${this.element.classList.contains(StateClassNames.OPEN)}`,
    );
  }

  private addEventListeners(): void {
    if (this.toggleMenuButton === null) {
      throw new Error("toggleMenuButton doesn't exist");
    }

    this.addDisposableEventListener(this.toggleMenuButton, 'click', this.toggleMenu.bind(this));
  }

  private createMenuToggleTimeline(): TimelineMax {
    const timeline = new TimelineMax({
      paused: true,
      reversed: true,
    });

    const [upper, middle, lower] = this.hamburgerMenuIconLines;

    if (upper && middle && lower) {
      timeline
        .to(middle, 0.1, { scale: 0.1, transformOrigin: '50% 50%' }, 'burg')
        .add('rotate')
        .to(upper, 0.2, { y: '30' }, 'rotate')
        .to(lower, 0.2, { y: '-30' }, 'rotate')
        .to(upper, 0.2, { rotationZ: 45, transformOrigin: '50% 50%' }, 'rotate')
        .to(lower, 0.2, { rotationZ: -45, transformOrigin: '50% 50%' }, 'rotate')
        .eventCallback('onStart', () => {
          this.element.classList.add(StateClassNames.OPEN);
          this.toggleMenuButton?.setAttribute('aria-expanded', 'true');
        })
        .eventCallback('onReverseComplete', () => {
          this.element.classList.remove(StateClassNames.OPEN);
          this.toggleMenuButton?.setAttribute('aria-expanded', 'false');
        });
    }

    return timeline;
  }

  public toggleMenu = () => {
    this.dispatcher.dispatchEvent(
      new M47HamburgerMenuEvent(M47HamburgerMenuEvent.types.TOGGLE_MENU),
    );

    this.menuToggleTimeline.reversed()
      ? this.menuToggleTimeline.restart()
      : this.menuToggleTimeline.reverse();
  };

  public dispose(): void {
    this.resetMenuIconTimeout && window.clearTimeout(this.resetMenuIconTimeout);
    super.dispose();
  }
}
