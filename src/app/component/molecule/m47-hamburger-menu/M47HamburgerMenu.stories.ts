import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M47HamburgerMenuProps } from './M47HamburgerMenu.types';
import M47DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps<M47HamburgerMenuProps>(M47DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M47 Hamburger Menu',
  component: require('./M47HamburgerMenu'),
  argTypes: flattenedPropsTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders hamburger menu.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m47-hamburger-menu }}
  </hbs>`,
});

export const Default = withMappedProps<M47HamburgerMenuProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
