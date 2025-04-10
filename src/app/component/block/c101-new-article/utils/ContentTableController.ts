import IDeviceStateData from 'seng-device-state-tracker/lib/IDeviceStateData';

import TableOfContents from '../component/organism/table-of-contents/TableOfContents.lazy';
import deviceStateTracker from '../../../../util/deviceStateTracker';
import mq from '../../../../data/shared-variable/media-queries.json';

export type ContentTableType = 'sticky' | 'regular';

type ContentTableControllerProps = {
  regularContentTable: TableOfContents;
  stickyContentTable: TableOfContents;
  type: ContentTableType;
};

export class ContentTableController {
  private stickyContentTable: TableOfContents;
  private regularContentTable: TableOfContents;
  public activeContentTable: TableOfContents;

  constructor({ regularContentTable, stickyContentTable, type }: ContentTableControllerProps) {
    this.regularContentTable = regularContentTable;
    this.stickyContentTable = stickyContentTable;
    this.activeContentTable = this.getContentTableByType(type);
  }

  private getContentTableByType(type: ContentTableType) {
    return type === 'sticky' ? this.stickyContentTable : this.regularContentTable;
  }

  public setActiveContentTable(type: ContentTableType) {
    this.activeContentTable = this.getContentTableByType(type);
  }
}
