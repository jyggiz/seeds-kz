import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M39StepIndicatorsProps } from './M39StepIndicators.types';
import M39DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M39DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M39 Step Indicators',
  component: require('./M39StepIndicators'),
  argTypes: {
    ...flattenedPropsTypes,
    dir: {
      control: { type: 'select', options: ['rtl', 'ltr'] },
      description: 'Specifies direction.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a step indicator.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m39-step-indicators }}
  </hbs>`,
});

export const Default = withMappedProps<M39StepIndicatorsProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
