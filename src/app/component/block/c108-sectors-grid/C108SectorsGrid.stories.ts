import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C108SectorsGridData from './data/default.yaml';
import { C108SectorsGridProps } from './C108SectorsGrid.types';

const flattenedData = flattenProps(C108SectorsGridData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C108SectorsGrid`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>
     {{> c108-sectors-grid}}
    </hbs>`,
  };
};

export const Default = withMappedProps<C108SectorsGridProps>(Template);

Default.args = flattenedData;
