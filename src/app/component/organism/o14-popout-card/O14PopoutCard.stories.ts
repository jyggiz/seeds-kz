import O13Data from './/data/basketball.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { O14PopoutCardProps } from './O14PopoutCard.types';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedData = flattenProps(O13Data);

const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: 'NEOM/organism/O14 Popout Card',
  component: require('./O14PopoutCard.lazy'),

  argTypes: {
    ...flatPropTypes,
  },
};

const Template = () => {
  return {
    template: `<hbs><div style="padding: 60px 0">{{> o14-popout-card }}</div></hbs>`,
  };
};

export const Default = withMappedProps<O14PopoutCardProps>(Template);

Default.args = flattenedData;
