import { StateClassNames } from 'app/data/enum/StateClassNames';
import trackEvent, { TrackingEventNames } from './TrackingEvent';

type sliderTrackingProps = {
  slides: readonly HTMLElement[];
  titleSelectorName: string;
  componentId: string;
  componentName: string;
};

function trackSliderItemsVisibility({
  slides,
  titleSelectorName,
  componentId,
  componentName,
}: sliderTrackingProps) {
  const visibleSlides = slides.filter((slide) => slide.classList.contains(StateClassNames.VISIBLE));

  const content = visibleSlides.map((slide) => ({
    content_index: slides.indexOf(slide),
    content_type: slide.querySelector('[data-play-button]')
      ? 'video'
      : slide.querySelector('[data-image-img]')
      ? 'image'
      : 'text',
    content_title: slide.querySelector<HTMLElement>(titleSelectorName)?.textContent?.trim() || '',
    content_title_in_english:
      slide.querySelector<HTMLElement>(titleSelectorName)?.textContent?.trim() || '',
  }));

  const payload = {
    event: TrackingEventNames.VIEW_CONTENT,
    aem_component_id: componentId,
    aem_component_name: componentName,
    asset_total_count: slides.length,
    content,
  };
  trackEvent(payload);
}

export default trackSliderItemsVisibility;
