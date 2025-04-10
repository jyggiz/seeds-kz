import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C117FlipCardsData from './data/default.yaml';
import { C117FlipCardsProps } from './C117FlipCards.types';

const flattenedData = flattenProps(C117FlipCardsData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C117FlipCards`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c117-flip-cards}}</hbs>`,
  };
};

export const Default = withMappedProps<C117FlipCardsProps>(Template);

Default.args = flattenedData;
