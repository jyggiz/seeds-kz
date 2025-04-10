import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O102CardsGridData from './data/default.yaml';
import { O102CardsGridProps } from './O102CardsGrid.types';
import O102CardsGrid from './O102CardsGrid.lazy';

const flattenedData = flattenProps(O102CardsGridData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O102CardsGrid`,
  component: O102CardsGrid,
  argTypes: {
    ...flatPropTypes,
  },
} as Meta;

export const Default = withMappedProps<O102CardsGridProps>(() => ({
  template: `<hbs>
        {{> O102CardsGrid \}}
      </hbs>`,
}));

Default.args = flattenedData;
