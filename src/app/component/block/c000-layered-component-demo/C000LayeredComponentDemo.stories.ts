import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C000LayeredComponentDemoData from './data/default.yaml';
import { C000LayeredComponentDemoProps } from './C000LayeredComponentDemo.types';

const flattenedData = flattenProps(C000LayeredComponentDemoData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C000LayeredComponentDemo`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c000-layered-component-demo }}</hbs>`,
  };
};

export const Default = withMappedProps<C000LayeredComponentDemoProps>(Template);

Default.args = flattenedData;
