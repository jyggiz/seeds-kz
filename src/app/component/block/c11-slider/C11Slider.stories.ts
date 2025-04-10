import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import C11Data from './data/beach-games-news.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import C11Slider from './C11Slider.lazy';
import { C11SliderProps } from './C11Slider.types';

const flattenedData = flattenProps(C11Data);

const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: C11Slider,
  title: `NEOM/block/C11Slider`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

const Template = () => {
  return {
    template: `<hbs>
        {{> c11-slider }}
        </hbs>`,
  };
};

export const Default = withMappedProps<C11SliderProps>(Template);

Default.args = flattenedData;
