import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O99DynamicGridData from './data/default.yaml';
import { O99DynamicGridProps } from './O99DynamicGrid.types';

const flattenedData = flattenProps(O99DynamicGridData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O99DynamicGrid`,
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
                <style>
                  .m-tileCta {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--color-dark-gold);
                  }
                </style>
                {{> o99-dynamic-grid }}
               </hbs>`,
  };
};

export const Default = withMappedProps<O99DynamicGridProps>(Template);

Default.args = flattenedData;
