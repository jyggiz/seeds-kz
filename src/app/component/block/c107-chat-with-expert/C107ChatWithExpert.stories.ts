import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C107NewExpertCardsData from './data/default.yaml';
import { C107ChatWithExpertProps } from './C107ChatWithExpert.types';

const flattenedData = flattenProps(C107NewExpertCardsData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C107NewExpertCards`,
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
        {{> c107-chat-with-expert }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C107ChatWithExpertProps>(Template);

Default.args = flattenedData;
