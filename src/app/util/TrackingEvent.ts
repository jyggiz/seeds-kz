import { removeHtmlExtension } from './cleanUrl';
import { removeNewlinesAndNumbers } from './removeNewLines';

declare global {
  interface Window {
    dataLayer: Array<any>;
  }
}

export enum TrackingEventActions {
  SLIDER_CLICK = 'Slider Click',
  CTA_CLICK = 'CTA Button Click',
  ACCORDION_CLICK = 'Accordion Item Open',
}

export enum TrackingEventCategories {
  DOWNLOAD = 'Download',
  SLIDER_INTERACTION = 'Slider Interaction',
  CTA = 'CTA',
  ACCORDION_DROPDOWN_MENU = 'Accordion Menu',
}

export enum TrackingEventNames {
  DOWNLOAD = 'download',
  GENERATE_LEAD = 'generate_lead',
  SECTOR_CLICK = 'sector_click',
  CLICK = 'click',
  LINK_CLICK = 'link_click',
  SLIDER_IMPRESSION = 'slider_impression',
  SLIDER_INTERACTION = 'slider_interaction',
  VIDEO_PROGRESS = 'video_progress',
  VIDEO_START = 'video_start',
  VIDEO_PAUSE = 'video_pause',
  VIDEO_COMPLETE = 'video_complete',
  VIDEO_SEEK = 'video_seek',
  VIDEO_CLOSE = 'video_close',
  VIRTUAL_PAGEVIEW = 'virtual_page_view',
  FORM_FUNNEL = 'form_funnel',
  FORM_IMPRESSION = 'form_impression',
  SOCIAL_FAVICON = 'social_favicon',
  SEARCH_RESULT_CLICK = 'search_result_click',
  NAVIGATION_CLICK = 'navigation_click',
  SEARCH = 'search',
  SELECT_CONTENT = 'select_content',
  VIEW_CONTENT = 'view_content',
  FORM_ERROR = 'form_error',
  ACCORDION_CLICK = 'accordion_click',
}

export interface VideoTrackingEventBaseProps {
  src: string;
  title: string;
  titleInEnglish: string;
}

export type VirtualPageview = {
  event: TrackingEventNames.VIRTUAL_PAGEVIEW;
  page: {
    canonicalURL: string;
    locale: string;
    lastModifiedDate: string;
    title: string;
    path: string;
    url: string;
    hostname: string;
  };
  user: {
    id: string;
  };
};

export type DownloadTrackingEvent = {
  event: TrackingEventNames.DOWNLOAD;
  eventAction: string;
  eventCategory: TrackingEventCategories.DOWNLOAD;
  eventLabel: string | ReadonlyArray<string>;
};

export type SearchEvent = SearchTrackingEvent & {
  event: TrackingEventNames.SEARCH;
};

export type GenerateLeadEvent = {
  readonly event: TrackingEventNames.GENERATE_LEAD;
  readonly form?: {
    readonly form_id: string;
    readonly form_name: string;
    readonly form_intent: string;
    readonly form_error_message: string | null;
  };
  readonly response: {
    readonly message: string;
    readonly status: number;
  };
  readonly user: {
    readonly form_id: string;
    readonly lang_code: string;
    readonly contact_permissions: string | null;
    readonly email: string;
    readonly g_recaptcha_response: string;
  };
};

export type SectorClickTrackingEvent = {
  event: TrackingEventNames.SECTOR_CLICK;
  sector: {
    titleInEnglish: string;
    title: string;
  };
};

export type AccordionClickTrackingEvent = {
  event: TrackingEventNames.ACCORDION_CLICK;
  aem_component_id: string;
  aem_component_name: string;
  question: string;
  expert?: string;
};

export type CTAClickTrackingEvent = {
  event: TrackingEventNames.CLICK;
  eventLabel: string;
  eventAction: TrackingEventActions.CTA_CLICK;
  eventCategory: TrackingEventCategories.CTA;
  componentId: string;
  linkDomain?: string;
  linkUrl?: string;
  clickText?: string;
};

export type LinkClickTrackingEvent = {
  event: TrackingEventNames.LINK_CLICK;
  aem_component_name: string;
  aem_component_id: string;
  linkDomain: string;
  linkUrl: string;
};

export type SliderImpressionTrackingEvent = {
  event: TrackingEventNames.SLIDER_IMPRESSION;
  slider: {
    slideTitleInEnglish: string;
    slideOrder: number;
  };
  componentId: string;
  componentName: string;
};

export type SliderInteractionTrackingEvent = {
  event: TrackingEventNames.SLIDER_INTERACTION;
  sliderAction: TrackingEventActions.SLIDER_CLICK;
  sliderCategory: TrackingEventCategories.SLIDER_INTERACTION;
  componentId: string;
  componentName: string;
};

export type VideoStartTrackingEvent = {
  event: TrackingEventNames.VIDEO_START;
  video: VideoTrackingEventBaseProps;
};

export type VideoPauseTrackingEvent = {
  event: TrackingEventNames.VIDEO_PAUSE;
  video: VideoTrackingEventBaseProps;
};

export type VideoCompleteTrackingEvent = {
  event: TrackingEventNames.VIDEO_COMPLETE;
  video: VideoTrackingEventBaseProps;
};

export type VideoProgressTrackingEvent = {
  event: TrackingEventNames.VIDEO_PROGRESS;
  video: VideoTrackingEventBaseProps & {
    milestone: string;
  };
};

export type VideoSeekTrackingEvent = {
  event: TrackingEventNames.VIDEO_SEEK;
  video: VideoTrackingEventBaseProps;
};

export type VideoCloseTrackingEvent = {
  event: TrackingEventNames.VIDEO_CLOSE;
  video: VideoTrackingEventBaseProps;
};

export type FormFunnelTrackingEvent = {
  event: TrackingEventNames.FORM_FUNNEL;
  step: number;
  form: {
    titleInEnglish: string;
  };
};

export type SocialFaviconTrackingEvent = {
  event: TrackingEventNames.SOCIAL_FAVICON;
  aem_component_name: string;
  aem_component_id: string;
  social_network: string;
};

export type SelectContentTrackingEvent = {
  event: TrackingEventNames.SELECT_CONTENT;
  aem_component_name: string;
  aem_component_id: string;
  link_domain: string;
  link_url: string;
  click_text: string;
};

export type FormImpressionTrackingEvent = {
  readonly event: TrackingEventNames.FORM_IMPRESSION;
  readonly form_name: string;
  readonly intent?: string;
  readonly step?: string | number;
};

export type Content = {
  readonly content_index: string;
  readonly content_type: 'page' | 'article';
  readonly content_title: string;
  readonly content_title_in_english: string;
  readonly content_category: string;
  readonly content_category_total_count: string;
  readonly link_url: string;
};

export type SearchTrackingEvent = {
  readonly search_term: string;
};

export type SearchResultClickTrackingEvent = SearchTrackingEvent & {
  readonly event: TrackingEventNames.SEARCH_RESULT_CLICK;
  readonly search_term: string;
  readonly content: ReadonlyArray<Content>;
};

export type NavigationClickTrackingEvent = {
  readonly event: TrackingEventNames.NAVIGATION_CLICK;
  readonly navigation_type: 'header' | 'footer' | 'breadcrumbs';
  readonly link_domain: string;
  readonly link_url: string;
  readonly click_text: string;
};

export type SliderNavigationTrackingEvent = {
  readonly event: TrackingEventNames.VIEW_CONTENT;
  aem_component_name: string;
  aem_component_id: string;
  asset_total_count: number;
  content: ReadonlyArray<{
    content_index: number;
    content_type: 'text' | 'video' | 'image';
    content_title: string;
    content_title_in_english: string;
  }>;
};

export type FormErrorTrackingEvent = {
  readonly event: TrackingEventNames.FORM_ERROR;
  readonly form_id: string;
  readonly form_name: string;
  readonly form_intent: string;
  readonly form_step: number | string;
  readonly form_error: boolean;
  readonly form_error_message: string | null;
};

type TrackingEventTypes =
  | VirtualPageview
  | DownloadTrackingEvent
  | GenerateLeadEvent
  | SectorClickTrackingEvent
  | SliderInteractionTrackingEvent
  | SliderImpressionTrackingEvent
  | VideoStartTrackingEvent
  | VideoPauseTrackingEvent
  | VideoProgressTrackingEvent
  | VideoCompleteTrackingEvent
  | VideoSeekTrackingEvent
  | VideoCloseTrackingEvent
  | CTAClickTrackingEvent
  | LinkClickTrackingEvent
  | AccordionClickTrackingEvent
  | FormFunnelTrackingEvent
  | SocialFaviconTrackingEvent
  | FormImpressionTrackingEvent
  | SearchResultClickTrackingEvent
  | NavigationClickTrackingEvent
  | SearchEvent
  | SliderNavigationTrackingEvent
  | FormErrorTrackingEvent
  | SelectContentTrackingEvent;

export default function trackEvent(event: TrackingEventTypes): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log('customEvent', event);
  }

  function filterEvent(event: TrackingEventTypes): TrackingEventTypes {
    const filteredEvent = { ...event };

    if ('link_url' in filteredEvent) {
      filteredEvent.link_url = removeHtmlExtension(filteredEvent.link_url);
    }

    if ('click_text' in filteredEvent) {
      filteredEvent.click_text = removeNewlinesAndNumbers(filteredEvent.click_text);
    }

    if ('contact_permissions' in filteredEvent) {
      filteredEvent.contact_permissions =
        filteredEvent.contact_permissions === 'yes' || filteredEvent.contact_permissions === 'no'
          ? filteredEvent.contact_permissions
          : 'yes';
    }
    return filteredEvent;
  }

  if (window.dataLayer) {
    window.dataLayer.push(filterEvent(event));
  }
}
