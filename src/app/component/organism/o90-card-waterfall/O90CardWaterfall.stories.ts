import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O90CardWaterfallData from './data/default.yaml';
import { O90CardWaterfallProps } from './O90CardWaterfall.types';

const flattenedData = flattenProps(O90CardWaterfallData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O90CardWaterfall`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>
    <style>
      :root {
        --color-storybook-background: var(--color-black);
      }
</style>
{{> o90-card-waterfall }}
</hbs>`,
  };
};

export const Default = withMappedProps<O90CardWaterfallProps>(Template);

Default.args = flattenedData;
