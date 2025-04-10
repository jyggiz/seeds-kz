import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M21SectorMenuItemProps } from './M21SectorMenuItem.types';
import M21DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M21DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M21 Sector Menu Item',
  component: require('./M21SectorMenuItem'),
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
    {{> m21-sector-menu-item }}
  </hbs>`,
});

export const Default = withMappedProps<M21SectorMenuItemProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
