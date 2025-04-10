import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { M46MediaCardProps } from './M46MediaCard.types';
import M46DefaultData from './data/default.yaml';
import M46VideoData from './data/example-video.yaml';

const flattenedDefaultData = flattenProps(M46DefaultData);
const flattenedVideoData = flattenProps(M46VideoData);

const flattenedArgTypes = [flattenedDefaultData, flattenedVideoData].reduce(
  (flattenedArgTypes, data) => {
    const argTypes = getFlatPropTypes(data);

    return { ...flattenedArgTypes, ...argTypes };
  },
  {} as ArgTypes,
);

export default {
  title: 'NEOM/molecule/M46 Media Card',
  component: require('./M46MediaCard'),
  argTypes: {
    ...flattenedArgTypes,
    id: {
      control: { type: 'text' },
      description: 'Specifies id of the component.',
    },
    variant: {
      control: {
        type: 'select',
        options: ['circle', 'landscape', 'portrait', 'square', 'widescreen'],
      },
      description: 'Specifies style of an image.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a media card.',
      },
    },
  },
};

const DefaultTemplate = () => ({
  template: `<hbs>
    {{> m46-media-card }}
  </hbs>`,
});

export const Default = withMappedProps<M46MediaCardProps>(DefaultTemplate);
export const Video = withMappedProps<M46MediaCardProps>(DefaultTemplate);

Default.args = flattenedDefaultData;
Video.args = flattenedVideoData;
