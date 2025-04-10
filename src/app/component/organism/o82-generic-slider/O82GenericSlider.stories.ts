import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import O82GenericSlider from './O82GenericSlider.lazy';
import O82Data from './data/list-sorter.yaml';
import { O82GenericSliderProps } from './O82GenericSlider.types';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

const flattenedData = flattenProps(O82Data);

const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: O82GenericSlider,
  title: `NEOM/organism/O82GenericSlider`,
  args: {},
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

const Template = () => {
  return {
    template: `<hbs>
        {{> o82-generic-slider }}
        </hbs>`,
  };
};

export const Default = withMappedProps<O82GenericSliderProps>(Template);

Default.args = flattenedData;
