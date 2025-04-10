import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O88TransitionSlideData from './data/default.yaml';
import { O88TransitionSlideProps } from './O88TransitionSlide.types';
import O88TransitionSlide from './O88TransitionSlide.lazy';

const flattenedData = flattenProps(O88TransitionSlideData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: O88TransitionSlide,
  title: `NEOM/organism/O88TransitionSlide`,
  args: {},
  argTypes: flatPropTypes,
  parameters: {},
} as Meta;

// the simplest way to create stories is to render a component with different arguments multiple times
const Template = () => {
  return {
    template: `<hbs>
      {{> o88-transition-slide }}
    </hbs>`,
  };
};

export const Default = withMappedProps<O88TransitionSlideProps>(Template);

Default.args = flattenedData;
