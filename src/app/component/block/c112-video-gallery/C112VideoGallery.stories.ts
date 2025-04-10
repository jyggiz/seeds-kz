import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C112VideoGalleryData from './data/default.yaml';
import { C112VideoGalleryProps } from './C112VideoGallery.types';

const flattenedData = flattenProps(C112VideoGalleryData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C112VideoGallery`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>{{> c112-video-gallery }}</hbs>`,
  };
};

export const Default = withMappedProps<C112VideoGalleryProps>(Template);

Default.args = flattenedData;
