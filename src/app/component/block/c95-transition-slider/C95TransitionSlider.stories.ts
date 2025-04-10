import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { C95TransitionSliderProps } from './C95TransitionSlider.types';
import C95TransitionSlider from './C95TransitionSlider.lazy';
import C95TransitionSliderData from './data/default.yaml';

const flattenedData = flattenProps(C95TransitionSliderData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: C95TransitionSlider,
  title: `NEOM/block/C95TransitionSlider`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>
      {{> c95-transition-slider }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C95TransitionSliderProps>(Template);

Default.args = flattenedData;
