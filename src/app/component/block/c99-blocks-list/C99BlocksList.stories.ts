import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C99BlocksListData from './data/default.yaml';
import { C99BlocksListProps } from './C99BlocksList.types';

const flattenedData = flattenProps(C99BlocksListData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C99BlocksList`,
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
      {{> c99-blocks-list }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C99BlocksListProps>(Template);

Default.args = flattenedData;
