import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M48SliderPaginationProps } from './M48SliderPagination.types';
import M48DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M48DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M48 Slider Pagination',
  component: require('./M48SliderPagination'),
  argTypes: {
    ...flattenedPropsTypes,
    autoplay: {
      control: { type: 'boolean' },
      description: 'Specifies animation autoplay.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a pagination list with text.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m48-slider-pagination }}
  </hbs>`,
});

export const Default = withMappedProps<M48SliderPaginationProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
