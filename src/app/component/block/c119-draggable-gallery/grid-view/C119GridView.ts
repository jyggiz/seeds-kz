import { TweenMax } from 'gsap';
import Draggable from 'gsap/Draggable';
import debounce from 'lodash/debounce';
import { renderItem } from 'muban-core/lib/utils/dataUtils';
import { addEventListener } from 'seng-disposable-event-listener';
import ThrowPropsPlugin from '../../../../vendor/gsap/ThrowPropsPlugin';
import { StateClassNames } from '../../../../data/enum/StateClassNames';
import cursorTemplate from './cursor.hbs?include';
import './C119GridView.scss';
import eases from '../../../../animation/eases';
import AbstractTransitionComponent from '../../../AbstractTransitionComponent';
import C119GridViewTransitionController from './C119GridViewTransitionController';
import C119DraggableGalleryEvent from '../C119DraggableGalleryEvent';

ThrowPropsPlugin;

export default class C119GridView extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c119-grid-view';

  public readonly transitionController: C119GridViewTransitionController =
    new C119GridViewTransitionController(this);

  private readonly dragContainer = this.getElement<HTMLDivElement>('[data-drag-container]');

  private draggableInstance: Draggable | null = null;

  private dragItems = this.getElements<HTMLButtonElement>('[data-drag-item]');
  private headingItems = this.getElements<HTMLDivElement>('[data-heading-item]');

  private cursor = this.getElement<HTMLDivElement>('[data-cursor]');
  private vectorWrapper = this.getElement<HTMLDivElement>('[data-vector-wrapper]');
  private mousePosition = { x: window.innerWidth / 2, y: window.innerHeight };
  private mouseStandstillCounter = 0;
  private mouseStandstillCounterIntervalIndex = 0;

  private activeIndex = 0;

  private static readonly itemGutterSize = 60;
  private static readonly itemColumnCount = 3;

  public callbacks: {
    onItemClick?: (item: HTMLButtonElement, index: number) => void;
    onActiveIndexChange?: (index: number) => void;
  } = {
    onItemClick: (item: HTMLButtonElement) => {
      this.dispatcher.dispatchEvent(
        new C119DraggableGalleryEvent(C119DraggableGalleryEvent.OPEN_SLIDE_MODAL, item),
      );
    },
  };

  public async adopted() {
    this.addEventListeners();

    if (this.vectorWrapper) renderItem(this.vectorWrapper, cursorTemplate, {});

    this.initDraggable();
  }

  private addEventListeners() {
    this.disposables.add(
      addEventListener(window, 'resize', debounce(this.onResize.bind(this), 100)),
    );

    this.disposables.add(addEventListener(window, 'mousemove', this.onMouseMove.bind(this)));

    this.dragItems.forEach((item, index) =>
      this.disposables.add(
        addEventListener(item, 'click', () => this.callbacks.onItemClick?.(item, index)),
      ),
    );

    this.disposables.add(addEventListener(window, 'keydown', this.onKeyDown.bind(this)));

    this.mouseStandstillCounterIntervalIndex = setInterval(() => {
      if (this.mouseStandstillCounter >= 1) {
        this.cursor?.classList.add(StateClassNames.HOVER);
      }

      this.mouseStandstillCounter++;
    }, 1000);
  }

  private initDraggable() {
    this.draggableInstance?.kill();

    this.draggableInstance = Draggable.create(this.dragContainer, {
      bounds: this.bounds,
      edgeResistance: 0.65,
      throwProps: true,
      zIndexBoost: false,
      allowEventDefault: true,
      cursor: 'none',
      snap: {
        x: (endValue: number) => {
          return Math.round(endValue / this.itemWidth) * this.itemWidth;
        },
        y: (endValue: number) => {
          return Math.round(endValue / this.itemHeight) * this.itemHeight;
        },
      },
      onDrag: () => {
        this.onActiveIndexChange();
      },
      onThrowUpdate: () => {
        this.onActiveIndexChange();
      },
    })[0];

    this.onActiveIndexChange();
  }

  private onKeyDown(event: KeyboardEvent) {
    const keyMap = new Map([
      ['ArrowLeft', this.activeIndex - 1],
      ['ArrowRight', this.activeIndex + 1],
      ['ArrowUp', this.activeIndex - C119GridView.itemColumnCount],
      ['ArrowDown', this.activeIndex + C119GridView.itemColumnCount],
    ]);

    this.moveToIndex(keyMap.get(event.key) ?? this.activeIndex);
  }

  private moveToIndex(index: number) {
    if (!this.dragContainer) return;

    if (index < 0) return;
    if (index > this.dragItems.length - 1) return;

    const x = (index % C119GridView.itemColumnCount) - 1;
    const y = Math.floor(index / C119GridView.itemColumnCount) - 1;

    this.dragItems[index].focus({
      preventScroll: true,
    });

    TweenMax.to(this.dragContainer, 1.2, {
      x: x * -this.itemWidth,
      y: y * -this.itemHeight,
      ease: eases.VinnieInOut,
      onUpdate: () => {
        this.draggableInstance?.update();
        this.onActiveIndexChange();
      },
    });
  }

  private onActiveIndexChange() {
    this.activeIndex = this.calculateActiveIndex();
    this.callbacks.onActiveIndexChange?.(this.activeIndex);
  }

  private get itemWidth() {
    return this.dragItems[0].getBoundingClientRect().width;
  }

  private get itemHeight() {
    return this.dragItems[0].getBoundingClientRect().height;
  }

  private get bounds() {
    const totalWidth = C119GridView.itemColumnCount * this.itemWidth + C119GridView.itemGutterSize;
    const totalHeight = C119GridView.itemColumnCount * this.itemWidth + C119GridView.itemGutterSize;

    const xLimit = (totalWidth - this.itemWidth) / 2;
    const yLimit = (totalHeight - this.itemHeight) / 2 - this.itemHeight / 2;

    return {
      minX: -xLimit,
      maxX: xLimit,
      minY: -yLimit,
      maxY: yLimit,
    };
  }

  private onResize() {
    this.initDraggable();
  }

  private onMouseMove(event: MouseEvent) {
    this.mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };

    this.mouseStandstillCounter = 0;

    if (this.cursor)
      TweenMax.set(this.cursor, {
        x: this.mousePosition.x,
        y: this.mousePosition.y,
      });

    this.cursor?.classList.remove(StateClassNames.HOVER);
  }

  private calculateActiveIndex() {
    const x = this.draggableInstance?.x || 0;
    const y = this.draggableInstance?.y || 0;

    const xIndex = -Math.round(x / this.itemWidth) + 1;
    const yIndex = -Math.round(y / this.itemWidth) + 1;

    const currentIndex = this.activeIndex;
    const newIndex = xIndex + yIndex * C119GridView.itemColumnCount;

    this.dragItems[currentIndex]?.classList.remove(StateClassNames.ACTIVE);
    this.headingItems[currentIndex]?.classList.remove(StateClassNames.ACTIVE);
    this.dragItems[newIndex]?.classList.add(StateClassNames.ACTIVE);
    this.headingItems[newIndex]?.classList.add(StateClassNames.ACTIVE);

    return newIndex;
  }

  public dispose() {
    super.dispose();
    this.draggableInstance?.kill();
    clearInterval(this.mouseStandstillCounterIntervalIndex);
  }
}
