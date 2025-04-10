import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C103VerticalCarouselData from './data/default.yaml';
import { C103VerticalCarouselProps } from './C103VerticalCarousel.types';

const flattenedData = flattenProps(C103VerticalCarouselData);

export default {
  title: `NEOM/block/C103VerticalCarousel`,
  args: {},
  argTypes: getFlatPropTypes(flattenedData),
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `
      <hbs>
        {{> c103-vertical-carousel}}
      </hbs>`,
  };
};

export const Default = withMappedProps<C103VerticalCarouselProps>(Template);

Default.args = flattenedData;
