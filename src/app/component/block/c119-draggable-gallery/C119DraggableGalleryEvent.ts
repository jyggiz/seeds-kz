import { AbstractEvent } from 'seng-event';

export default class C119DraggableGalleryEvent extends AbstractEvent {
  public static OPEN_SLIDE_MODAL: string = 'OPEN_SLIDE_MODAL';

  public readonly element: HTMLElement;

  constructor(type: string, element: HTMLElement, bubbles?: boolean, cancelable?: boolean) {
    super(type, bubbles, cancelable);

    this.element = element;
  }
  clone(): C119DraggableGalleryEvent {
    return new C119DraggableGalleryEvent(this.type, this.element, this.bubbles, this.cancelable);
  }
}
