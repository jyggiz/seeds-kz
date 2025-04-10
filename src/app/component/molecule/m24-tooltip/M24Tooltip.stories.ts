import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M24TooltipProps } from './M24Tooltip.types';
import M24DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps<M24TooltipProps>(M24DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M24 Tooltip',
  component: require('./M24Tooltip'),
  argTypes: {
    ...flattenedPropsTypes,
    isStatic: {
      control: { type: 'boolean' },
      description: 'Changes absolute position into relative.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders tooltip. Can not be visible without script manipulations.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m24-tooltip }}
  </hbs>`,
});

export const Default = withMappedProps<M24TooltipProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
