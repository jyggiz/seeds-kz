import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M15ActionButtonProps from './M15ActionButton.types';
import M15DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M15DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M15 Action Button',
  component: require('./M15ActionButton'),
  argTypes: {
    ...flattenedPropsTypes,
    target: {
      control: { type: 'select', options: ['_self', '_blank'] },
      description: 'Specifies the target',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an action button',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m15-action-button }}
  </hbs>`,
});

export const Default = withMappedProps<M15ActionButtonProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
