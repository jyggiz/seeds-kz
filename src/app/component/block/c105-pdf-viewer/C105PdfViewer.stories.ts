import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C105PdfViewerData from './data/default.yaml';
import { C105PdfViewerProps } from './C105PdfViewer.types';

const flattenedData = flattenProps(C105PdfViewerData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C105PdfViewer`,
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
      {{> c105-pdf-viewer}}
    </hbs>`,
  };
};

export const Default = withMappedProps<C105PdfViewerProps>(Template);

Default.args = flattenedData;
