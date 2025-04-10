import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import O81MotionSlide from './O81MotionSlide.lazy';
import O81Data from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { O81MotionSlideProps } from './O81MotionSlide.types';

const flattenedData = flattenProps(O81Data);

const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: O81MotionSlide,
  title: `NEOM/organism/O81MotionSlide`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

const Template = () => {
  return {
    template: `<hbs>
        {{> o81-motion-slide }}
    </hbs>`,
  };
};

export const Default = withMappedProps<O81MotionSlideProps>(Template);

Default.args = flattenedData;
