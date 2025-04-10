import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';

import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';

import O13ContentCardData from './data/card-full.yaml';
import O13TwitterCardData from './data/twitter-image-description.yaml';
import O13TextCardData from './data/text-button.yaml';
import O13StoryCardData from './data/story-card.yaml';
import O13NewsroomCardData from './data/newsroom-card.yaml';
import O13NewsCardData from './data/formula-e-partner.yaml';
import O13ArticleCardHighlightedData from './data/article-card-highlighted.yaml';

import { O13ContentCardProps } from './O13ContentCard.types';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import { ArgTypes } from '@muban/storybook/dist/client/preview/types-6-0';

const flattenedDefaultData = flattenProps(O13ContentCardData);
const flattenedArticleCardHighlightedData = flattenProps(O13ArticleCardHighlightedData);
const flattenedTwitterData = flattenProps(O13TwitterCardData);
const flattenedTextData = flattenProps(O13TextCardData);
const flattenedStoryData = flattenProps(O13StoryCardData);
const flattenedNewsroomData = flattenProps(O13NewsroomCardData);
const flattenedNewsData = flattenProps(O13NewsCardData);

const flattenedDataTypes = [
  flattenedDefaultData,
  flattenedTwitterData,
  flattenedTextData,
  flattenedStoryData,
  flattenedNewsData,
  flattenedNewsroomData,
  flattenedArticleCardHighlightedData,
].reduce((argTypes, data) => {
  const myArgTypes = getFlatPropTypes(data);

  return { ...argTypes, ...myArgTypes };
}, {} as ArgTypes);

export default {
  title: `NEOM/organism/O13 Content Card`,
  args: {},
  argTypes: flattenedDataTypes,
  parameters: {},
} as Meta;

const Template = () => {
  return {
    template: `<hbs>{{> o13-content-card }}</hbs>`,
  };
};

const ContainedTemplate = () => {
  return {
    template: `<hbs><div class="u-container">{{> o13-content-card }}</div></hbs>`,
  };
};

export const Default = withMappedProps<O13ContentCardProps>(Template);
export const NewsCard = withMappedProps<O13ContentCardProps>(Template);
export const NewsroomCard = withMappedProps<O13ContentCardProps>(Template);
export const StoryCard = withMappedProps<O13ContentCardProps>(Template);
export const TextCard = withMappedProps<O13ContentCardProps>(Template);
export const TwitterCard = withMappedProps<O13ContentCardProps>(Template);
export const ArticleCardHighlighted = withMappedProps<O13ContentCardProps>(ContainedTemplate);

Default.args = flattenedDefaultData;
NewsCard.args = flattenedNewsData;
NewsroomCard.args = flattenedNewsroomData;
StoryCard.args = flattenedStoryData;
TextCard.args = flattenedTextData;
TwitterCard.args = flattenedTwitterData;
ArticleCardHighlighted.args = flattenedArticleCardHighlightedData;
