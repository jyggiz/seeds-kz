import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import C47MotionBanner from './C47MotionBanner.lazy';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import defaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { C47MotionBannerProps } from './C47MotionBanner.types';

const flattenedData = flattenProps(defaultData);

export default {
  component: C47MotionBanner,
  title: `NEOM/block/C47MotionBanner`,
  argTypes: getFlatPropTypes(flattenedData),
} as Meta;

const Template = () => ({
  template: `<hbs>
    {{> c47-motion-banner }}
</hbs>`,
});

export const Default = withMappedProps<C47MotionBannerProps>(Template);

Default.args = flattenedData;
