import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C98BreadcrumbsData from './data/default.yaml';
import { C98BreadcrumbsProps } from './C98Breadcrumbs.types';

const flattenedData = flattenProps(C98BreadcrumbsData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C98Breadcrumbs`,
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
          {{> c98-breadcrumbs }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C98BreadcrumbsProps>(Template);

Default.args = flattenedData;
