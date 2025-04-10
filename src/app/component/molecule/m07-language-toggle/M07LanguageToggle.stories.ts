import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { M07LanguageToggleProps } from './M07LanguageToggle.types';
import M07DefaultData from './data/default.yaml';

const flattenedDataDefaultExample = flattenProps(M07DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M07 Language Toggle',
  component: require('./M07LanguageToggle'),

  argTypes: flattenedPropsTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders an language toggle Card',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>{{> m07-language-toggle }}</hbs>`,
});

export const Default = withMappedProps<M07LanguageToggleProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
