import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C102SocialMediaData from './data/default.yaml';
import { C102SocialMediaProps } from './C102SocialMedia.types';

const flattenedData = flattenProps(C102SocialMediaData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C102SocialMedia`,
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
      {{> c102-social-media }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C102SocialMediaProps>(Template);

Default.args = flattenedData;
