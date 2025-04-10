import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C111ShuffleHeroSliderData from './data/default.yaml';
import { C111ShuffleHeroSliderProps } from './C111ShuffleHeroSlider.types';

const flattenedData = flattenProps(C111ShuffleHeroSliderData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C111ShuffleHeroSlider`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c111-shuffle-hero-slider }}</hbs>`,
  };
};

export const Default = withMappedProps<C111ShuffleHeroSliderProps>(Template);

Default.args = flattenedData;
