import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import { O45FormProps } from '../../organism/o45-form/O45Form.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';

export type C96NewsletterSubscriptionProps = {
  id?: string;
  scrollComponent?: boolean;
  padding?: BlockComponentPadding;
  alignment?: 'start' | 'center'; // default value is 'start'
  background?: M34ComponentBackgroundProps;
  header: M04ComponentHeaderProps;
  successHeader: M04ComponentHeaderProps;
  form: O45FormProps;
};
