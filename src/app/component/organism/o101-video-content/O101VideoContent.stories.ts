import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O101VideoContentData from './data/default.yaml';
import { O101VideoContentProps } from './O101VideoContent.types';

const flattenedData = flattenProps(O101VideoContentData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O101VideoContent`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> o101-video-content }}</hbs>`,
  };
};

export const Default = withMappedProps<O101VideoContentProps>(Template);

Default.args = flattenedData;
