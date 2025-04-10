import AbstractComponent from 'app/component/AbstractComponent';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import { TweenMax, TimelineMax, Linear } from 'gsap';
import { isRtl } from '../../../util/rtlUtils';
import eases from '../../../animation/eases';

export default class M48SliderPagination extends AbstractComponent {
  public static readonly displayName: string = 'm48-slider-pagination';

  public activeSlideIndex = 0;
  public slideDuration = 5;

  private readonly autoplay: boolean = false;

  private readonly _paginationBars = this.getElements('[data-pagination-bar-inner]');
  private timelines: ReadonlyArray<TimelineMax> = [];

  constructor(el: HTMLElement) {
    super(el);

    this.autoplay = Boolean(this.element.dataset.autoplay);
  }

  public adopted(): void {
    this.timelines = this.setupTimelines();
  }

  public get paginationBars(): ReadonlyArray<HTMLElement> {
    return this._paginationBars;
  }

  public showPassedPaginationBars(): void {
    this._paginationBars.forEach((item) => {
      const isPassed: boolean = this._paginationBars.indexOf(item) < this.activeSlideIndex;
      item.classList.toggle(StateClassNames.PASSED, isPassed);
    });
  }

  public toggleSlide(index: number) {
    if (index === 0) this.setupTimelines();

    this.paginationBars.forEach((bar, barIndex) => {
      if (barIndex === index) {
        if (this.autoplay) {
          this.timelines[barIndex].play(0);
        } else {
          TweenMax.to(bar, 0.3, {
            scaleX: 1,
            ease: eases.VinnieInOut,
            transformOrigin: isRtl() ? '100% 50%' : '0% 50%',
            onComplete: () => this.timelines[barIndex].pause(this.timelines[barIndex].duration()),
          });
        }
      } else if (barIndex < index) {
        this.timelines[barIndex].pause();
        TweenMax.to(bar, 0.3, {
          scaleX: 1,
          ease: eases.VinnieInOut,
          onComplete: () => this.timelines[barIndex].pause(this.timelines[barIndex].duration()),
        });
      } else {
        this.timelines[barIndex].pause(0);
      }
    });
  }

  private setupTimelines(): ReadonlyArray<TimelineMax> {
    return this.paginationBars.map((bar) => {
      const timeline = new TimelineMax({ paused: true });

      timeline
        .set(bar, {
          transformOrigin: isRtl() ? '100% 50%' : '0% 50%',
        })
        .fromTo(
          bar,
          this.slideDuration,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            ease: Linear.easeNone,
          },
        );

      return timeline;
    });
  }
}
