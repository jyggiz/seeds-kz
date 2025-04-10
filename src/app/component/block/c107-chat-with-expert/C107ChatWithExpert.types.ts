import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import { O89ExpertInformationProps } from '../../organism/o89-expert-information/O89ExpertInformation.types';
import { M48SliderPaginationProps } from '../../molecule/m48-slider-pagination/M48SliderPagination.types';
import { ChatDetailsProps } from './component/organism/chat-details/ChatDetails.types';
import { ChatQuoteProps } from './component/organism/chat-quote/ChatQuote.types';
import ChatDetails from './component/organism/chat-details/ChatDetails.lazy';
import O89ExpertInformation from 'app/component/organism/o89-expert-information/O89ExpertInformation.lazy';

export type C107ChatWithExpertProps = {
  scrollComponent?: boolean;
  id?: string;
  eyebrow: A04EyebrowProps & {
    size: 'small' | 'medium' | 'large' | 'xLarge';
  };
  slides: ReadonlyArray<
    ChatDetailsProps &
      ChatQuoteProps & {
        expert: O89ExpertInformationProps;
        eyebrow: A04EyebrowProps;
      } & M48SliderPaginationProps
  >;
};

export type C107Slide = {
  expertBio: HTMLElement | null;
  chatQuote: HTMLElement | null;
  chatDetails: ChatDetails | null;
  information: O89ExpertInformation | null;
  element: HTMLUListElement;
};
