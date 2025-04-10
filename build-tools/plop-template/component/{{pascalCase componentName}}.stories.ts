import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import {{pascalCase componentName}}Data from './data/default.yaml';
import { {{pascalCase componentName}}Props } from './{{pascalCase componentName}}.types';
{{#if lazy}}
import {{pascalCase componentName}} from './{{pascalCase componentName}}.lazy';
{{^}}
import {{pascalCase componentName}} from './{{pascalCase componentName}}';
{{/if}}

const flattenedData = flattenProps({{pascalCase componentName}}Data);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/{{type}}/{{pascalCase componentName}}`,
  component: {{pascalCase componentName}},
  argTypes: {
    ...flatPropTypes,
  },
} as Meta;

export const Default = withMappedProps<{{pascalCase componentName}}Props>(() => ({
  template: `<hbs>
        \{{> {{pascalCase componentName}} \}}
      </hbs>`,
}));

Default.args = flattenedData;
