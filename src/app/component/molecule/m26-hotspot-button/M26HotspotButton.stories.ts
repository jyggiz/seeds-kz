import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M26HotspotButtonTypes } from './M26HotspotButton.types';
import M26DefaultData from './data/event-hotspot.yaml';

const flattenedDataDefaultExample = flattenProps<M26HotspotButtonTypes>(M26DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map((path) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  title: 'NEOM/molecule/M26 Hotspot Button',
  component: require('./M26HotspotButton'),
  argTypes: {
    ...flattenedPropsTypes,
    alternateHotspotStyle: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Specifies an icon. Leave blank for a default plus sign',
    },
    variant: {
      control: { type: 'select', options: [undefined, 'event'] },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a hotspot item for map components',
      },
    },
  },
};

const DefaultTemplate = () => {
  return {
    template: `<hbs><div style="position:relative;left:20px;top:20px;">{{> m26-hotspot-button }}</div></hbs>`,
  };
};

export const Default = withMappedProps<M26HotspotButtonTypes>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
