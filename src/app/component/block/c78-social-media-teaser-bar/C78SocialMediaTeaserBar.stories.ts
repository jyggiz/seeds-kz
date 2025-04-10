import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import C78SocialMediaTeaserBar from './C78SocialMediaTeaserBar.lazy';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import C78Data from './data/default.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { C78SocialMediaTeaserBarProps } from './C78SocialMediaTeaserBar.types';

const flattenedData = flattenProps(C78Data);

const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: C78SocialMediaTeaserBar,
  title: `NEOM/block/C78SocialMediaTeaserBar`,
  args: {
    ...flatPropTypes,
  },
  argTypes: {},
  parameters: {},
} as Meta;

const Template = () => {
  return {
    template: `<hbs>
        {{> c78-social-media-teaser-bar }}
        </hbs>`,
  };
};

export const Default = withMappedProps<C78SocialMediaTeaserBarProps>(Template);

Default.args = flattenedData;
