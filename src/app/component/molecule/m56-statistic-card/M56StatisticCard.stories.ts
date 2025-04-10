import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import M56StatisticCardData from './data/default.yaml';
import { M56StatisticCardProps } from './M56StatisticCard.types';

const flattenedData = flattenProps(M56StatisticCardData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/molecule/M56StatisticCard`,
  component: require('./M56StatisticCard'),
  args: {},
  argTypes: flatPropTypes,
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>
      {{> m56-statistic-card }}
    </hbs>`,
  };
};

export const Default = withMappedProps<M56StatisticCardProps>(Template);

Default.args = flattenedData;
