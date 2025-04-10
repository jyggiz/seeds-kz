import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import O72RegionSliderContent from './O72RegionSliderContent.lazy';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import C05DataProperties from '../../block/c05-region-slider/data/properties-example.yaml';
import { O72RegionSliderContentProps } from './O72RegionSliderContent.types';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import omit from 'lodash-es/omit';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';

const o72ArgTypes: ArgTypes = {};
Object.keys(
  flattenProps(omit(flattenProps(C05DataProperties), ['dark', 'activeItem', 'id'])),
).forEach((key) => {
  o72ArgTypes[key] = {
    control: 'text',
  };
});

export default {
  component: O72RegionSliderContent,
  title: `NEOM/organism/O72RegionSliderContent`,
  argTypes: {
    dark: {
      control: 'boolean',
    },
    id: {
      control: 'text',
    },
    activeItem: {
      control: 'number',
    },
    ...o72ArgTypes,
  },
  excludeStories: ['o72ArgTypes'],
  parameters: {},
} as Meta;

const Template = () => ({
  template: `<hbs>
      <style>
        .story-wrapper {
          width: 100%;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .o-regionSliderContent, .o-regionSliderContent__mapItemList {
          height: 100%;
        }
      </style>
      <div class="story-wrapper">
        {{> o72-region-slider-content }}
      </div>
    </hbs>`,
});

export const DefaultProperties = withMappedProps<O72RegionSliderContentProps>(Template);

DefaultProperties.args = flattenProps(C05DataProperties);

export { o72ArgTypes };
