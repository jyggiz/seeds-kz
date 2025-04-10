import { AbstractEvent } from 'seng-event';

type O35ArticleCardEventData = {
  readonly title: string;
  readonly title_in_english: string;
  readonly content_index: string;
  readonly content_category: string;
  readonly content_category_total_count: string;
  readonly link_url: string;
};

export class O35ArticleCardEvent extends AbstractEvent {
  public static types = {
    CLICK: 'CLICK',
  };

  public data: O35ArticleCardEventData;

  constructor(
    type: string,
    data: O35ArticleCardEventData,
    bubbles?: boolean,
    cancelable?: boolean,
    setTimeStamp?: boolean,
  ) {
    super(type, bubbles, cancelable, setTimeStamp);
    this.data = data;
  }
  public clone(): O35ArticleCardEvent {
    return new O35ArticleCardEvent(this.type, this.data, this.bubbles, this.cancelable);
  }
}
