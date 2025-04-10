import AbstractComponent from '../../../../../AbstractComponent';
import { setAsInitialised } from '../../../../../../util/setAsInitialised';
import { toggleBodyScrollState } from '../../../../../../util/toggleBodyScrollState';
import C107ChatWithExpert from '../../../C107ChatWithExpert.lazy';

export default class ChatDetails extends AbstractComponent {
  public static readonly displayName: string = 'chat-details';
  private readonly content = this.getElement('[data-chat-content]');
  private readonly parentSection = this.element.closest<HTMLElement>(
    `[data-component="${C107ChatWithExpert.displayName}"]`,
  );

  private handleWheel(event: Event) {
    const wheelEvent = event as WheelEvent;
    if (!this.content || this.element.dataset['visible'] === 'false' || !this.parentSection) {
      if (this.element.dataset['active'] === 'true') {
        toggleBodyScrollState('enabled');
      }
      return;
    }
    const { offsetTop } = this.parentSection;
    const isScrolledToTop = scrollY + wheelEvent.deltaY > offsetTop;
    const isScrolledToContentBottom =
      Math.ceil(this.content.scrollTop) >= this.content.scrollHeight - this.content.clientHeight;
    const isScrolledToBottom = scrollY + wheelEvent.deltaY <= offsetTop;
    const isScrolledToContentTop = Math.floor(this.content.scrollTop) === 0;

    if (
      (wheelEvent.deltaY > 0 && isScrolledToTop && !isScrolledToContentBottom) ||
      (wheelEvent.deltaY < 0 && isScrolledToBottom && !isScrolledToContentTop)
    ) {
      toggleBodyScrollState('disabled');
    } else {
      toggleBodyScrollState('enabled');
    }
  }

  public addWheelEventListener() {
    window.addEventListener('wheel', this.handleWheel.bind(this), { passive: true });
  }

  public disposeWheelEventListener() {
    window.removeEventListener('wheel', this.handleWheel.bind(this));
  }

  public resetScrollPosition() {
    if (!this.content) {
      return;
    }

    this.content.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public async adopted(): Promise<void> {
    setAsInitialised(this.element);
    this.addWheelEventListener();
  }

  public dispose() {
    super.dispose();
    this.disposeWheelEventListener();
  }
}
