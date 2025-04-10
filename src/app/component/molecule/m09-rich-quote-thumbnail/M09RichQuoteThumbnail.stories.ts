import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import M09RichQuoteThumbnailProps from './M09RichQuoteThumbnail.types';
import M09DefaultData from './data/default.yaml';

const flattenedDataDefaultExample = flattenProps(M09DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M09 Rich Quote Thumbnail',
  component: require('./M09RichQuoteThumbnail'),
  argTypes: flattenedPropsTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders a quote/quotes with text, image and icon.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m09-rich-quote-thumbnail }}
  </hbs>`,
});

export const Default = withMappedProps<M09RichQuoteThumbnailProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
