import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import C57MotionSlider from './C57MotionSlider.lazy';
import C57Data from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { C57MotionSliderProps } from './C57MotionSlider.types';

const flattenedData = flattenProps(C57Data);

const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: C57MotionSlider,
  title: `NEOM/block/C57MotionSlider`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

const Template = () => {
  return {
    template: `<hbs>
        {{> c57-motion-slider }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C57MotionSliderProps>(Template);

Default.args = flattenedData;
