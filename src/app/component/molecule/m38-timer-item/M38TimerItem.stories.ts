import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M38TimerItemProps } from './M38TimerItem.types';
import M38DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M38DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M38 Timer Item',
  component: require('./M38TimerItem'),
  argTypes: flattenedPropsTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders timer.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m38-timer-item }}
  </hbs>`,
});

export const Default = withMappedProps<M38TimerItemProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
