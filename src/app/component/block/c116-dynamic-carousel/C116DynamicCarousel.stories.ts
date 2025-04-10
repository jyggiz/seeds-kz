import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C116DynamicCarouselData from './data/default.yaml';
import { C116DynamicCarouselProps } from './C116DynamicCarousel.types';

const flattenedData = flattenProps(C116DynamicCarouselData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C116DynamicCarousel`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c116-dynamic-carousel }}</hbs>`,
  };
};

export const Default = withMappedProps<C116DynamicCarouselProps>(Template);

Default.args = flattenedData;
