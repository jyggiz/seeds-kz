import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O72RegionSliderContentTransitionController from './O72RegionSliderContentTransitionController';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import mobileContentTemplate from './o72-region-slider-content-mobile.hbs?include';
import desktopContentTemplate from './o72-region-slider-content-desktop.hbs?include';
import Swiper, { Pagination } from 'swiper';
import deviceStateTracker from '../../../util/deviceStateTracker';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import debounce from 'lodash-es/debounce';
import sleep from '../../../util/sleep';
import { TweenMax } from 'gsap';
import { updateClassForItems } from '../../../util/stateClassNamesToggle';

import './o72-region-slider-content.scss';

export default class O72RegionSliderContent extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o72-region-slider-content';

  public readonly transitionController: O72RegionSliderContentTransitionController;

  private swiperInstances: Array<Swiper | null> = [];

  private readonly sliderContainers = this.getElements('[data-swiper-slider]');
  private readonly mapItems = this.getElements('[data-map-item]');
  private readonly secondaryContent = this.getElements('[data-map-secondaryContent]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O72RegionSliderContentTransitionController(this);

    if (this.element.classList.contains('-properties')) {
      this.mapItems[0].classList.add(StateClassNames.ACTIVE);
    }
  }

  public async adopted(): Promise<void> {
    this.addEventListeners();

    if (this.element.classList.contains('-properties')) {
      this.renderContent();
      this.initSwipers();
    }

    await document.fonts.ready;
    this.setComponentHeight();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener(
      window,
      'resize',
      debounce(() => {
        if (this.element.classList.contains('-properties')) {
          this.swiperInstances.forEach((swiper) => swiper?.destroy());
          this.renderContent();
          if (deviceStateTracker.currentDeviceState.state <= 3) this.initSwipers();
        }
        this.setComponentHeight();
      }, 50),
    );
  }

  private setComponentHeight(): void {
    TweenMax.set(this.mapItems[0].parentElement!, {
      minHeight: Math.max(...this.mapItems.map((item) => item.clientHeight)),
    });
  }

  private renderContent(): void {
    this.mapItems.forEach((item, index) => {
      const jsonString = this.sliderContainers[index].dataset.mapItemData;
      if (!jsonString) return;
      const data = JSON.parse(jsonString) as Record<string, unknown> | undefined;
      if (!this.sliderContainers[index] || !data) return;
      if (deviceStateTracker.currentDeviceState.state <= 3)
        renderItem(this.sliderContainers[index], mobileContentTemplate, data);
      else
        renderItem(this.sliderContainers[index], desktopContentTemplate, {
          ...data,
          ...this.sliderContainers[index].dataset,
        });
    });
  }

  private initSwipers(): void {
    this.mapItems.forEach((item, index) => {
      if (this.sliderContainers[index]) {
        Swiper.use([Pagination]);

        this.swiperInstances[index] = new Swiper(this.sliderContainers[index], {
          direction: 'horizontal',
          loop: false,
          pagination: {
            bulletClass: 'a-pageIndicators__item',
            bulletElement: 'span',
            bulletActiveClass: StateClassNames.ACTIVE,
            currentClass: StateClassNames.ACTIVE,
            el: this.getElement<HTMLElement>(
              '[data-slider-pagination]',
              this.sliderContainers[index],
            )!,
            type: 'bullets',
          },
        });
      }
    });
  }

  public async showRegion(index: number): Promise<void> {
    updateClassForItems({
      removeFrom: this.mapItems,
      addToOne: this.mapItems[index],
      className: StateClassNames.ACTIVE,
    });
    updateClassForItems({
      removeFrom: this.secondaryContent,
      addToOne: this.secondaryContent[index],
      className: StateClassNames.ACTIVE,
    });

    await sleep(500);
    this.swiperInstances.forEach((swiper) => swiper?.slideTo(0));
  }

  public dispose() {
    super.dispose();

    this.swiperInstances.forEach((swiper) => swiper?.destroy());
  }
}
