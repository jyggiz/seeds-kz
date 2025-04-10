import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C104JourneyData from './data/default.yaml';
import { C104JourneyProps } from './C104Journey.types';

const flattenedData = flattenProps(C104JourneyData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C104Journey`,
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
                <style>:root{--color-accent: var(--color-gold);}</style>
                {{> c104-journey }}
              </hbs>`,
  };
};

export const Default = withMappedProps<C104JourneyProps>(Template);

Default.args = flattenedData;
