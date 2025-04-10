import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C109ExploreMapData from './data/default.yaml';
import { C109ExploreMapProps } from './C109ExploreMap.types';

const flattenedData = flattenProps(C109ExploreMapData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C109ExploreMap`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c109-explore-map }}</hbs>`,
  };
};

export const Default = withMappedProps<C109ExploreMapProps>(Template);

Default.args = flattenedData;
