import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import O65Data from './data/default.yaml';
import O65MobileInstructions from './O65MobileInstructions.lazy';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { O65MobileInstructionsProps } from './O65MobileInstructions.types';

export default {
  component: O65MobileInstructions,
  title: `NEOM/organism/O65MobileInstructions`,
  argTypes: {
    content: {
      control: {
        type: 'text',
      },
    },
    icon__0__name: {
      control: {
        type: 'text',
      },
    },
    icon__1__name: {
      control: {
        type: 'text',
      },
    },
    button__label: {
      control: {
        type: 'text',
      },
    },
    button__theme: {
      control: {
        type: 'text',
      },
    },
    button__size: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {},
} as Meta;

const Template = () => ({
  template: `<hbs>
        {{> o65-mobile-instructions }}
        </hbs>`,
});

export const Default = withMappedProps<O65MobileInstructionsProps>(Template);

Default.args = flattenProps(O65Data);
