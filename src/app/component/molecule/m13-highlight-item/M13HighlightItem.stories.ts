import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import M13HighlightItemProps from './M13HighlightItem.types';
import M13DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps<M13HighlightItemProps>(M13DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M13 Highlight Item',
  component: require('./M13HighlightItem'),
  argTypes: flattenedPropsTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders a highlight item element',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
  <div>
    {{> m13-highlight-item }}
  </div>
</hbs>`,
});

export const Default = withMappedProps<M13HighlightItemProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
