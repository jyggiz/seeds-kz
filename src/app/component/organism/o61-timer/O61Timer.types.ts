import { M38TimerItemProps } from './../../molecule/m38-timer-item/M38TimerItem.types';
import { A03HeadingElements } from '../../atom/a03-heading/A03Heading.types';

export type O61TimerProps = {
  id?: string;
  variant: A03HeadingElements;
  date: string;
  displayOptions: {
    days?: M38TimerItemProps;
    hours: M38TimerItemProps;
    minutes: M38TimerItemProps;
    seconds: M38TimerItemProps;
  };
};
