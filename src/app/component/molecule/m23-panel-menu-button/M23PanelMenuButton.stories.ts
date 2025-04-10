import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M23PanelMenuButtonProps } from './M23PanelMenuButton.types';
import M23DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M23DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M23 Panel Menu Button',
  component: require('./M23PanelMenuButton'),
  argTypes: {
    ...flattenedPropsTypes,
    back: {
      control: { type: 'boolean' },
      description: 'Shows chevron icon on the left or right side.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders menu button.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m23-panel-menu-button }}
  </hbs>`,
});

export const Default = withMappedProps<M23PanelMenuButtonProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
