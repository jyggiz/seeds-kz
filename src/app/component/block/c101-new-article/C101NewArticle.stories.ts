import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';

import C101ArticleData from './data/default.yaml';
import { C101NewArticleProps } from './C101NewArticle.types';

const flattenedData = flattenProps(C101ArticleData);
const flatPropTypes = getFlatPropTypes(flattenedData);

export default {
  title: `NEOM/block/C101Article`,
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
        {{> c101-new-article }}
    </hbs>`,
  };
};

export const Default = withMappedProps<C101NewArticleProps>(Template);

Default.args = flattenedData;
