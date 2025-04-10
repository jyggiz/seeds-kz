import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C115CardsGridData from './data/default.yaml';
import { C115CardsGridProps } from './C115CardsGrid.types';

const flattenedData = flattenProps(C115CardsGridData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C115CardsGrid`,
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
     {{> c115-cards-grid}}
    </hbs>`,
  };
};

export const Default = withMappedProps<C115CardsGridProps>(Template);

Default.args = flattenedData;
