import O18Data from './data/example.yaml';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import O18StoryCardProps from './O18StoryCard.types';

const flattenedData = flattenProps(O18Data);

const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: 'NEOM/organism/O18 Story Card',
  component: require('./O18StoryCard.lazy'),

  argTypes: {
    ...flatPropTypes,
  },
};

// The component size is according to the parent. The max-width was added because the parent is not in the example.

const Template = () => {
  return {
    template: `<hbs>
    <div style="max-width:300px;" >
    {{> o18-story-card }}
    </div>
  </hbs>`,
  };
};

export const Default = withMappedProps<O18StoryCardProps>(Template);

Default.args = flattenedData;
