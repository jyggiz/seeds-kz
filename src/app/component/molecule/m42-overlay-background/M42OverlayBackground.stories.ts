import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { M42OverlayBackgroundProps } from './M42OverlayBackground.types';
import M42DefaultData from './data/default.yaml';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';

const flattenedDataDefaultExample = flattenProps(M42DefaultData);
const flattenedPropsTypes = getFlatPropTypes(flattenedDataDefaultExample);

export default {
  title: 'NEOM/molecule/M42 Overlay Background',
  component: require('./M42OverlayBackground'),
  argTypes: flattenedPropsTypes,
  parameters: {
    docs: {
      description: {
        component: 'Renders an overlay background for other components.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m42-overlay-background }}
  </hbs>`,
});

export const Default = withMappedProps<M42OverlayBackgroundProps>(DefaultTemplate);
Default.args = flattenedDataDefaultExample;
