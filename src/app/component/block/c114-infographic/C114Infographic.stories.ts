import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C114InfographicData from './data/default.yaml';
import { C114InfographicProps } from './C114Infographic.types';

const flattenedData = flattenProps(C114InfographicData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C114Infographic`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c114-infographic}}</hbs>`,
  };
};

export const Default = withMappedProps<C114InfographicProps>(Template);

Default.args = flattenedData;
