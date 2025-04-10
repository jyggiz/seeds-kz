import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M22PersonCardProps from './M22PersonCard.types';
import M22DefaultData from './data/gavin.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M22DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M22 Person Card',
  component: require('./M22PersonCard'),
  argTypes: {
    ...flattenedPropsTypes,
    dark: {
      control: {
        type: 'boolean',
      },
      description: 'Toggle between normal and dark mode.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an Article Card',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
  {{#if @root.dark}}<style>:root{--color-storybook-background:var(--color-black);}</style>{{/if}}
  <div style="{{#if @root.dark}}--component-highlight-color: var(--color-gold); color: var(--color-white);{{^}}--component-highlight-color: var(--color-dark-gold);{{/if}}max-width: {{#if @root.highlighted}}1080px{{^}}420px{{/if}}">
    {{> m22-person-card @root }}
  </div>
</hbs>`,
});

export const Default = withMappedProps<M22PersonCardProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
