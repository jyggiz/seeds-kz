import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C119DraggableGalleryData from './data/default.yaml';
import { C119DraggableGalleryProps } from './C119DraggableGallery.types';
import C119DraggableGallery from './C119DraggableGallery.lazy';

const flattenedData = flattenProps(C119DraggableGalleryData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C119DraggableGallery`,
  component: C119DraggableGallery,
  argTypes: {
    ...flatPropTypes,
  },
} as Meta;

export const Default = withMappedProps<C119DraggableGalleryProps>(() => ({
  template: `<hbs>
        {{> C119DraggableGallery \}}
      </hbs>`,
}));

Default.args = flattenedData;
