import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M20ProjectMenuItemProps } from './M20ProjectMenuItem.types';
import M20DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M20DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M20 Project Menu Item',
  component: require('./M20ProjectMenuItem'),
  argTypes: {
    ...flattenedPropsTypes,
    variant: {
      control: { type: 'select', options: ['dropdown', 'panel'] },
      description: 'Item variant.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders menu item of page navigation.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m20-project-menu-item }}
  </hbs>`,
});

export const Default = withMappedProps<M20ProjectMenuItemProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
