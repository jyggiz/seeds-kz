import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import C09ContentGroupData from './data/default.yaml';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { C09ContentGroupProps } from './C09ContentGroup.types';
import C09ContentGroup from './C09ContentGroup.lazy';

const flattenedData = flattenProps(C09ContentGroupData);
const flattenedPropsTypes = getFlatPropTypes(flattenedData);

export default {
  title: 'NEOM/block/C09 Content Group',
  component: C09ContentGroup,
  argTypes: {
    ...flattenedPropsTypes,
    padding__start: {
      control: {
        type: 'select',
        options: ['large', 'regular', 'undefined'],
      },
    },
    padding__end: {
      control: {
        type: 'select',
        options: ['large', 'regular', 'undefined'],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a content group component',
      },
    },
  },
};

const Template = () => ({
  template: `<hbs>
            {{> c09-content-group }}
        </hbs>`,
});

export const Default = withMappedProps<C09ContentGroupProps>(Template);

Default.args = flattenedData;
