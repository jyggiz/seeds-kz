import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M44CopyProgressIndicatorProps } from './M44CopyProgressIndicator.types';
import M44DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M44DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M44 Copy Progress Indicator',
  component: require('./M44CopyProgressIndicator.lazy'),
  argTypes: flattenedPropsTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Renders a progress indicator which pops up with label from the i18 variables list.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m44-copy-progress-indicator }}
  </hbs>`,
});

export const Default = withMappedProps<M44CopyProgressIndicatorProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
