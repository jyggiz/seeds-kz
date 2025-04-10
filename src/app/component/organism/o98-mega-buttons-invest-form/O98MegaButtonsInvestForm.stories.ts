import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import O98MegaButtonsInvestFormData from './data/default.yaml';
import { O98MegaButtonsInvestFormProps } from './O98MegaButtonsInvestForm.types';

const flattenedData = flattenProps(O98MegaButtonsInvestFormData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/organism/O98MegaButtonsInvestForm`,
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
                  html, body, #root {
                    width:100%;
                    height:100% !important;
                  }
                </style>
                <div style="width: 100%; height: 100%; background-color: var(--color-dark-accent); padding: 50px;">
                  <div style="position: relative;">
                    {{> o98-mega-buttons-invest-form  }}
                  </div>
                </div>
              </hbs>`,
  };
};

export const Default = withMappedProps<O98MegaButtonsInvestFormProps>(Template);

Default.args = flattenedData;
