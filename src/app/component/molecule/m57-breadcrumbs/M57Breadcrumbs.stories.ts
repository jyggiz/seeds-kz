import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import M57BreadcrumbsData from './data/default.yaml';
import { M57BreadcrumbsProps } from './M57Breadcrumbs.types';

const flattenedData = flattenProps(M57BreadcrumbsData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/molecule/M57Breadcrumbs`,
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
  <div class="story-wrapper">
      {{> m57-breadcrumbs }}
  </div>
</hbs>`,
  };
};

export const Default = withMappedProps<M57BreadcrumbsProps>(Template);

Default.args = flattenedData;
