import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O100StaticGridData from './data/default.yaml';
import { O100StaticGridProps } from './O100StaticGrid.types';

const flattenedData = flattenProps(O100StaticGridData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O100StaticGrid`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> o100-static-grid }}</hbs>`,
  };
};

export const Default = withMappedProps<O100StaticGridProps>(Template);

Default.args = flattenedData;
