import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O93BlockCtaData from './data/default.yaml';
import { O93BlockCtaProps } from './O93BlockCta.types';

const flattenedData = flattenProps(O93BlockCtaData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O93BlockCta`,
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
      {{> o93-block-cta }}
    </hbs>`,
  };
};

export const Default = withMappedProps<O93BlockCtaProps>(Template);

Default.args = flattenedData;
