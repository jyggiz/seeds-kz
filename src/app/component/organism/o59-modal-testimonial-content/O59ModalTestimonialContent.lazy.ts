import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O59ModalTestimonialContentTransitionController from './O59ModalTestimonialContentTransitionController';
import O87Testimonial from '../o87-testimonial/O87Testimonial.lazy';
import { getComponentForElement } from 'muban-core';

import './o59-modal-testimonial-content.scss';

export default class O59ModalTestimonialContent extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o59-modal-testimonial-content';

  public readonly transitionController: O59ModalTestimonialContentTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O59ModalTestimonialContentTransitionController(this);
  }

  public adopted() {
    this.testimonial?.toggleVisibility(true);
  }

  private get testimonial(): O87Testimonial | null {
    const element = this.getElement(`[data-component="${O87Testimonial.displayName}"]`);
    if (!element) return null;
    return getComponentForElement<O87Testimonial>(element);
  }
}
