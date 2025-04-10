import { Meta, Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import C33Data from './data/default.yaml';
import { C33GroupedContentSliderProps } from './C33GroupedContentSlider.types';
import C33GroupedContentSlider from './C33GroupedContentSlider.lazy';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

const flattenedData = flattenProps(C33Data);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  component: C33GroupedContentSlider,
  title: `NEOM/block/C33GroupedContentSlider`,
  argTypes: {
    ...flatPropTypes,
  },
  parameters: {},
} as Meta;

const Template = () => ({
  template: `<hbs>
      <style>
        .b-groupedContentSlider {
        height: 100vh;
        }
      </style>
    <div>
 {{> c33-grouped-content-slider }}
    </div>
  </hbs>`,
});

export const Default = withMappedProps<C33GroupedContentSliderProps>(Template);

Default.args = flattenedData;
