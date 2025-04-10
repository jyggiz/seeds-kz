import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O87TestimonialData from './data/default.yaml';
import { O87TestimonialProps } from './O87Testimonial.types';

const flattenedData = flattenProps(O87TestimonialData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O87Testimonial`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `
      <hbs>
        <style>
          .o-testimonial {
            opacity: 1;
            pointer-events: initial;
            visibility: visible;
          }
        </style>
        {{> organism/o87-testimonial }}
      </hbs>
`,
  };
};

export const Default = withMappedProps<O87TestimonialProps>(Template);

Default.args = flattenedData;
