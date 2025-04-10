import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C97SearchResultsData from './data/default.yaml';
import { C97SearchResultsProps } from './C97SearchResults.types';
import C97SearchResults from './C97SearchResults.lazy';

const flattenedData = flattenProps(C97SearchResultsData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: C97SearchResults,
  title: `NEOM/block/C97SearchResults`,
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
      {{> c97-search-results }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C97SearchResultsProps>(Template);

Default.args = flattenedData;
