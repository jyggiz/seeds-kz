import O19VideoCardData from './data/video.yaml';
import O19SocialCardData from './data/social.yaml';
import O19ArticleNoImageCardData from './data/article-no-image.yaml';
import O19ArticleWithImageCardData from './data/article-with-image.yaml';

export default {
  title: 'NEOM/organism/O19 Update Card',
  component: require('./O19UpdateCard.lazy'),
  argTypes: {
    dark: {
      control: {
        type: 'boolean',
      },
      description: 'Toggle between normal and dark mode.',
    },
    heading: {
      control: {
        type: 'object',
      },
      description: 'A03 Heading component with hard-coded size and element props.',
    },
    video: {
      control: {
        type: 'object',
      },
      description: '',
    },
    externalLink: {
      control: {
        type: 'text',
      },
      description: 'Hardcoded to open in a new window',
    },
    callToAction: {
      control: {
        type: 'object',
      },
      description: '',
    },
    image: {
      control: {
        type: 'object',
      },
      description: '',
    },
    authorInfo: {
      control: {
        type: 'object',
      },
      description: '',
    },
    variant: {
      control: { type: 'radio', options: ['none', 'social', 'video', 'article'] },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an Update Card',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
    {{#if @root.dark}}<style>:root { --color-storybook-background: var(--color-black); }</style>{{/if}}
    <div style="--card-size:420px;max-width:420px;
      {{#if @root.dark}}
      --component-background-color: var(--color-black);
      --component-highlight-color: var(--color-gold);
      --component-text-color: var(--color-white);
      {{/if}}">
        {{> o19-update-card @root }}
    </div></hbs>`,
});

export const ArticleNoImageCard = () => ({
  template: `<hbs>
    {{#if @root.dark}}<style>:root { --color-storybook-background: var(--color-black); }</style>{{/if}}
    <div style="--card-size:420px;max-width:420px;
      {{#if @root.dark}}
      --component-background-color: var(--color-black);
      --component-highlight-color: var(--color-gold);
      --component-text-color: var(--color-white);
      {{/if}}">
        {{> o19-update-card @root dark=@root.dark }}
    </div></hbs>`,
});

export const VideoCard = () => ({
  template: `<hbs>
    {{#if @root.dark}}<style>:root { --color-storybook-background: var(--color-black); }</style>{{/if}}
    <div style="--card-size:420px;max-width:420px;
      {{#if @root.dark}}
      --component-background-color: var(--color-black);
      --component-highlight-color: var(--color-gold);
      --component-text-color: var(--color-white);
      {{/if}}">
        {{> o19-update-card @root dark=@root.dark }}
    </div></hbs>`,
});

export const SocialCard = () => ({
  template: `<hbs>
    {{#if @root.dark}}<style>:root { --color-storybook-background: var(--color-black); }</style>{{/if}}
    <div style="--card-size:420px;max-width:420px;
      {{#if @root.dark}}
      --component-background-color: var(--color-black);
      --component-highlight-color: var(--color-gold);
      --component-text-color: var(--color-white);
      {{/if}}">
        {{> o19-update-card @root dark=@root.dark }}
    </div></hbs>`,
});

Default.args = O19ArticleWithImageCardData;
ArticleNoImageCard.args = O19ArticleNoImageCardData;
VideoCard.args = O19VideoCardData;
SocialCard.args = O19SocialCardData;
