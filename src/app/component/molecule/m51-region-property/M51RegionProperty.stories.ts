import { M51RegionPropertyProps } from './M51RegionProperty.types';
import data from './data/green-sea-turtle.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

const flattenedDataDefaultExample = flattenProps(data);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M51 Region Property',
  component: require('./M51RegionProperty'),
  argTypes: {
    ...flattenedPropsTypes,
    dark: { control: { type: 'boolean' } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Renders a single Region property, consisting of an image, heading and description.',
      },
    },
  },
};

const DefaultTemplate = () => {
  return {
    template: `<hbs>
    {{#if dark}}<style>:root{--color-storybook-background:var(--color-black);--component-text-color:var(--color-white-70a); --component-heading-color: var(--color-white);}</style>{{/if}}
    {{> m51-region-property }}
</hbs>`,
  };
};

export const Default = withMappedProps<M51RegionPropertyProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
