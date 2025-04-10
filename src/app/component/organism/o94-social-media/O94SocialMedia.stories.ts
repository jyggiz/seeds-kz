import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O94SocialMediaData from './data/default.yaml';
import { O94SocialMediaProps } from './O94SocialMedia.types';

const flattenedData = flattenProps(O94SocialMediaData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O94SocialMedia`,
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
        {{> o94-social-media }}
      </hbs>`,
  };
};

export const Default = withMappedProps<O94SocialMediaProps>(Template);

Default.args = flattenedData;
