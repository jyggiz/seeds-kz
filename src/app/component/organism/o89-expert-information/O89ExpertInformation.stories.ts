import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O89ExpertInformationData from './data/default.yaml';
import { O89ExpertInformationProps } from './O89ExpertInformation.types';

const flattenedData = flattenProps(O89ExpertInformationData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O89ExpertInformation`,
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
    {{> o89-expert-information }}
</hbs>`,
  };
};

export const Default = withMappedProps<O89ExpertInformationProps>(Template);

Default.args = flattenedData;
