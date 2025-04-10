import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C113SimpleCardCarouselData from './data/default.yaml';
import { C113SimpleCardCarouselProps } from './C113SimpleCardCarousel.types';

const flattenedData = flattenProps(C113SimpleCardCarouselData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C113SimpleCardCarousel`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c113-simple-card-carousel }}</hbs>`,
  };
};

export const Default = withMappedProps<C113SimpleCardCarouselProps>(Template);

Default.args = flattenedData;
