import O40LightboxItemProps from '../o40-lightbox-item/O40LightboxItem.types';
import { O25PopupMessageContentProps } from '../o25-popup-message-content/O25PopupMessageContent.types';

export type O39LightboxContentProps = {
  content: {
    items: Array<O40LightboxItemProps>;
    termsOfUse: O25PopupMessageContentProps;
  };
  isExtended?: boolean;
};

export default O39LightboxContentProps;
