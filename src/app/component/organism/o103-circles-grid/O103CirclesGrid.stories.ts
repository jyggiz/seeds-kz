import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O103CirclesGridData from './data/default.yaml';
import { O103CirclesGridProps } from './O103CirclesGrid.types';
import O103CirclesGrid from './O103CirclesGrid.lazy';

const flattenedData = flattenProps(O103CirclesGridData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O103CirclesGrid`,
  component: O103CirclesGrid,
  argTypes: {
    ...flatPropTypes,
  },
} as Meta;

export const Default = withMappedProps<O103CirclesGridProps>(() => ({
  template: `<hbs>
        {{> O103CirclesGrid \}}
      </hbs>`,
}));

Default.args = flattenedData;
