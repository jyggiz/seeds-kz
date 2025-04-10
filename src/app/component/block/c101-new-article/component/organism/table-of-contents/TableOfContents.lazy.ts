import { AbstractEvent } from 'seng-event';
import { TweenMax } from 'gsap';
import AbstractComponent from '../../../../../AbstractComponent';
import eases from '../../../../../../animation/eases';

import './table-of-contents.scss';

export class TableOfContentEvent extends AbstractEvent {
  public static UPDATE: string = 'update';

  public readonly paragraphId: string = '';

  constructor(type: string, paragraphId: string, bubbles?: boolean, cancelable?: boolean) {
    super(type, bubbles, cancelable);

    this.paragraphId = paragraphId;
  }
  clone(): TableOfContentEvent {
    return new TableOfContentEvent(this.type, this.paragraphId, this.bubbles, this.cancelable);
  }
}

export default class TableOfContents extends AbstractComponent {
  public static readonly displayName: string = 'table-of-contents';

  private readonly items: Array<HTMLElement> = [
    ...this.element.querySelectorAll('[data-item]'),
  ] as Array<HTMLElement>;
  private readonly activeIndicator = this.getElement('[data-active-indicator]');

  constructor(el: HTMLElement) {
    super(el);

    this.addEventListeners();
  }

  public getParagraphsId(): Array<string> {
    return this.items
      .map((element) => {
        const anchor = element.getElementsByTagName('a')[0];
        if (!anchor) {
          return;
        }
        const id = anchor.getAttribute('href');
        if (!id) {
          return;
        }
        return id;
      })
      .filter((id): id is string => typeof id === 'string');
  }

  private setItemActive(index: number) {
    const li = this.items[index];
    if (!li) {
      return;
    }
    this.items
      .filter((_, _index) => _index !== index)
      .forEach((element) => element.classList.remove('-isActive'));
    li.classList.add('-isActive');
  }

  private putActiveIndicatorOnItem(index: number) {
    const li = this.items[index];
    if (!li || !this.activeIndicator) {
      return;
    }
    TweenMax.to(this.activeIndicator, 0.4, {
      ease: eases.VinnieInOut,
      y: li.offsetTop,
      height: li.clientHeight,
    });
  }

  changeActiveItem(id: string) {
    const index = this.items.findIndex(
      (element) => element.querySelector(`[href="#${id}"]`) !== null,
    );
    this.setItemActive(index);
    this.putActiveIndicatorOnItem(index);
  }

  private addClickListenerToItem(element: HTMLElement) {
    const anchor = element.getElementsByTagName('a')[0];

    anchor &&
      this.addDisposableEventListener(anchor, 'click', (event: MouseEvent) => {
        const id = (event.target as HTMLElement).getAttribute('href');
        if (!id) {
          return;
        }
        event.preventDefault();
        this.changeActiveItem(id.replace('#', ''));
        this.dispatcher.dispatchEvent(
          new TableOfContentEvent(TableOfContentEvent.UPDATE, id.replace('#', '')),
        );
      });
  }

  private addEventListeners(): void {
    this.items.forEach((element) => {
      this.addClickListenerToItem(element);
    });
  }
}
