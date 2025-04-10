import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import A32RecaptchaStatementData from './data/default.yaml';
import { A32RecaptchaStatementProps } from './A32RecaptchaStatement.types';

const flattenedData = flattenProps(A32RecaptchaStatementData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/atom/A32RecaptchaStatement`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs></hbs>`,
  };
};

export const Default = withMappedProps<A32RecaptchaStatementProps>(Template);

Default.args = flattenedData;
