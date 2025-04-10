import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import C000LayeredComponentDemoTransitionController from './C000LayeredComponentDemoTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C000Heading from './layers/heading/c000Heading.lazy';
import { getComponentForElement } from 'muban-core';
import C000Pagination from './layers/pagination/C000Pagination.lazy';
import C000Slider from './layers/slider/c000Slider.lazy';
import { StateClassNames } from 'app/data/enum/StateClassNames';

import './c000-layered-component-demo.scss';

export default class C000LayeredComponentDemo extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c000-layered-component-demo';
  public readonly headingLayer = this._headingLayer;
  public readonly paginationLayer = this._paginationLayer;
  public readonly sliderLayer = this._sliderLayer;

  public readonly transitionController: C000LayeredComponentDemoTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C000LayeredComponentDemoTransitionController(this);

    this.addEventListeners();
  }

  public adopted() {
    setAsInitialised(this.element);
  }

  private addEventListeners() {
    this.bindPaginationElementsToSlides();
  }

  private bindPaginationElementsToSlides() {
    const carouselSlides = this.sliderLayer.selectElements();
    const paginationElements = this.paginationLayer.selectElements();

    paginationElements.forEach((title, index) => {
      this.addDisposableEventListener(title, 'click', async () => {
        paginationElements.forEach((title) => title.classList.remove(StateClassNames.ACTIVE));
        title.classList.add(StateClassNames.ACTIVE);
        carouselSlides.forEach((slide) => slide.classList.remove(StateClassNames.ACTIVE));
        carouselSlides[index].classList.add(StateClassNames.ACTIVE);
        await this.sliderLayer.transitionInSlide(index);
      });
    });
  }

  // getters
  private get _headingLayer() {
    const headingLayerElement = this.getElement(`[data-component=${C000Heading.displayName}]`);
    if (headingLayerElement) {
      const headingLayerComponent = getComponentForElement<C000Heading>(headingLayerElement);

      return headingLayerComponent;
    }

    throw new Error('Could not find heading layer');
  }

  private get _paginationLayer() {
    const paginationLayerElement = this.getElement(
      `[data-component=${C000Pagination.displayName}]`,
    );
    if (paginationLayerElement) {
      const paginationLayerComponent =
        getComponentForElement<C000Pagination>(paginationLayerElement);

      return paginationLayerComponent;
    }

    throw new Error('Could not find pagination layer');
  }

  private get _sliderLayer() {
    const sliderLayerElement = this.getElement(`[data-component=${C000Slider.displayName}]`);
    if (sliderLayerElement) {
      const sliderLayerComponent = getComponentForElement<C000Slider>(sliderLayerElement);

      return sliderLayerComponent;
    }

    throw new Error('Could not find slider layer');
  }
}
