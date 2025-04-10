import O35Data from './data/example.yaml';

export default {
  title: 'NEOM/organism/O35 Article Card',
  component: require('./O35ArticleCard.lazy'),
  argTypes: {
    dark: {
      control: {
        type: 'boolean',
      },
      description: 'Toggle between normal and dark mode.',
    },
    highlighted: {
      control: {
        type: 'boolean',
      },
      description: 'The Highlighted variant uses a larger, row based layout.',
    },
    heading: {
      control: {
        type: 'object',
      },
      description: 'A03 Heading component with hard-coded size and element props.',
    },
    image: {
      control: {
        type: 'object',
      },
      description: 'A01 Image component.',
    },
    copy: {
      control: {
        type: 'text',
      },
      description: 'Plain text copy only, no rich text.',
    },
    link: {
      control: {
        type: 'object',
      },
      description: 'Uses the common Link props',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an Article Card',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
  {{#if @root.dark}}<style>:root{--color-storybook-background:var(--color-black);}</style>{{/if}}
  <div style="{{#if @root.dark}}--component-highlight-color: var(--color-gold); color: var(--color-white);{{^}}--component-highlight-color: var(--color-dark-gold);{{/if}}max-width: {{#if @root.highlighted}}1080px{{^}}420px{{/if}}">
    {{> o35-article-card @root }}
  </div>
</hbs>`,
});

Default.args = O35Data;
