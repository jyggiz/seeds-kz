import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import M03DefaultData from './data/default.yaml';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { M03StickyMediaProps } from './M03StickyMedia.types';

const flattenedData = flattenProps(M03DefaultData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: 'NEOM/molecule/M03 Sticky Media',
  component: require('./M03StickyMedia.lazy'),
  argTypes: {
    ...flatPropTypes,
    video: {
      control: {
        type: 'object',
      },
      description: 'O01 Video components config',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a block with image or video',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m03-sticky-media }}
  </hbs>`,
});

export const Default = withMappedProps<M03StickyMediaProps>(DefaultTemplate);
Default.args = flattenedData;
