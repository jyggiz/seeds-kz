import TrackingEvent, { FormImpressionTrackingEvent, TrackingEventNames } from './TrackingEvent';

type TrackingOptions = Omit<FormImpressionTrackingEvent, 'event' | 'form_name'> & {
  formName: FormImpressionTrackingEvent['form_name'];
};

export class FormImpressionTrackingUtil {
  private readonly intersectionObserver: IntersectionObserver;
  private hasIntersection = false;
  private readonly element: HTMLElement;
  private readonly options: TrackingOptions;

  constructor(
    element: HTMLElement,
    trackingOptions: TrackingOptions,
    intersectionOptions?: IntersectionObserverInit,
  ) {
    this.element = element;
    this.options = trackingOptions;
    this.intersectionObserver = new IntersectionObserver(
      this.onFormInView.bind(this),
      intersectionOptions || {
        threshold: 1,
      },
    );
  }

  public connect() {
    this.intersectionObserver.observe(this.element);
  }

  public disconnect() {
    this.intersectionObserver.disconnect();
  }

  private onFormInView(entries: ReadonlyArray<IntersectionObserverEntry>): void {
    if (entries[0].isIntersecting && !this.hasIntersection) {
      this.hasIntersection = true;

      TrackingEvent({
        event: TrackingEventNames.FORM_IMPRESSION,
        ...this.mutateTrackingOptions(this.options),
      });
    }
  }

  private mutateTrackingOptions(
    trackingOptions: TrackingOptions,
  ): Omit<FormImpressionTrackingEvent, 'event'> {
    return {
      intent: trackingOptions.intent,
      step: trackingOptions.step,
      form_name: trackingOptions.formName,
    };
  }
}
