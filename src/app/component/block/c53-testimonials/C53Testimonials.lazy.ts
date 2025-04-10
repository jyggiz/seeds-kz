import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import App from 'app/component/layout/app/App';
import deviceStateTracker from 'app/util/deviceStateTracker';
import { getAppComponent } from 'app/util/getElementComponent';
import { MODAL } from 'app/util/overlayActionTypes';
import { updateClassForItems } from 'app/util/stateClassNamesToggle';
import { TweenMax } from 'gsap';
import { DeviceStateEvent } from 'seng-device-state-tracker';
import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';
import mq from '../../../data/shared-variable/media-queries.json';
import { StateClassNames } from '../../../data/enum/StateClassNames';
import C53TestimonialsTransitionController from './C53TestimonialsTransitionController';
import { setAsInitialised } from 'app/util/setAsInitialised';
import O87Testimonial from '../../organism/o87-testimonial/O87Testimonial.lazy';
import { getComponentForElement } from 'muban-core';
import { O59ModalTestimonialContentProps } from 'app/component/organism/o59-modal-testimonial-content/O59ModalTestimonialContent.types';

import './c53-testimonials.scss';

const lazyO59Template = () =>
  import(
    '../../organism/o59-modal-testimonial-content/o59-modal-testimonial-content.hbs?include'
  ) as LoadTemplateImport<O59ModalTestimonialContentProps>;

export default class C53Testimonials extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c53-testimonials';

  public readonly transitionController: C53TestimonialsTransitionController;

  private logos = this.getElements('[data-logo-item]');
  private testimonialList = this.getElement('[data-testimonial-list]');
  private testimonials = this.getElements(`[data-component="${O87Testimonial.displayName}"]`);
  private testimonialComponents = this.testimonials.map((testimonial) =>
    getComponentForElement<O87Testimonial>(testimonial),
  );

  private app: App | null = null;
  private isMobile: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C53TestimonialsTransitionController(this);
    this.onDeviceStateChange(deviceStateTracker.currentDeviceState);
    this.addEventListeners();
  }

  public async adopted() {
    setAsInitialised(this.element);

    this.app = await getAppComponent();
  }

  private addEventListeners(): void {
    this.addDisposableEventListener<DeviceStateEvent>(
      deviceStateTracker,
      DeviceStateEvent.STATE_UPDATE,
      (event) => this.onDeviceStateChange(event.data),
    );

    this.logos.forEach((item, index) =>
      this.addDisposableEventListener(item, 'click', () => {
        this.onLogoClick(item);
        this.onLogoEnter(index);
      }),
    );

    if (!this.isMobile) this.onLogoEnter(0);
  }

  private async onLogoClick(item: HTMLElement): Promise<void> {
    if (!this.isMobile) return;
    const data = JSON.parse(<string>item.dataset.item);

    const [o59Template, overlay] = await Promise.all([lazyO59Template(), this.app?.overlay]);

    await overlay?.dispatchAction({
      type: MODAL.STANDARD_DYNAMIC,
      payload: {
        template: o59Template.default,
        data,
        options: this.element.classList.contains('t-dark') ? { classnames: ['t-navy'] } : {},
      },
    });
  }

  private onDeviceStateChange({ state }: IDeviceStateData): void {
    this.isMobile = state <= mq.deviceState.SMALL;
  }

  private onLogoEnter(index: number): void {
    if (this.isMobile) return;
    updateClassForItems({
      removeFrom: this.logos,
      addToOne: this.logos[index],
      className: StateClassNames.ACTIVE,
    });

    this.testimonialComponents.forEach((testimonialComponent, testimonialIndex) =>
      testimonialComponent.toggleVisibility(testimonialIndex === index),
    );

    this.testimonialList &&
      TweenMax.to(this.testimonialList, 0.5, {
        height: `${
          this.testimonialComponents.find((item) => item.isVisible)?.element.offsetHeight ?? 0
        }px`,
      });
  }
}
