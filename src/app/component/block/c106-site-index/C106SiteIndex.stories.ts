import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C106SiteIndexData from './data/default.yaml';
import { C106SiteIndexProps } from './C106SiteIndex.types';

const flattenedData = flattenProps(C106SiteIndexData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C106SiteIndex`,
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
      {{> c106-site-index }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C106SiteIndexProps>(Template);

Default.args = flattenedData;
