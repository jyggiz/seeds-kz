import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { o72ArgTypes } from '../../organism/o72-region-slider-content/O72RegionSliderContent.stories';
import C05RegionSlider from './C05RegionSlider.lazy';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import C05DataDefault from './data/text-example.yaml';
import C05DataProperties from './data/properties-example.yaml';
import { C05RegionSliderProps } from './C05RegionSlider.types';

export default {
  component: C05RegionSlider,
  title: `NEOM/block/C05RegionSlider`,
  args: {},
  argTypes: {
    dark: {
      control: 'boolean',
    },
    id: {
      control: 'text',
    },
    variant: {
      control: 'text',
    },
    activeItem: {
      control: 'number',
    },
    ...o72ArgTypes,
  },
} as Meta;

const Template = () => ({
  template: `<hbs>
      {{> c05-region-slider }}
    </hbs>`,
});

export const DefaultProperties = withMappedProps<C05RegionSliderProps>(Template);
export const Default = withMappedProps<C05RegionSliderProps>(Template);

Default.args = flattenProps(C05DataDefault);
DefaultProperties.args = flattenProps(C05DataProperties);
