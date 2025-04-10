import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O88SearchBarData from './data/default.yaml';
import { O88SearchBarProps } from './O88SearchBar.types';

const flattenedData = flattenProps(O88SearchBarData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O88SearchBar`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> o88-search-bar }}</hbs>`,
  };
};

export const Default = withMappedProps<O88SearchBarProps>(Template);

Default.args = flattenedData;
