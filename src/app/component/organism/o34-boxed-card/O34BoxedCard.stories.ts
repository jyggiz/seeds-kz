import O34Data from './data/example-default.yaml';
import O34IndexedData from './data/example-indexed.yaml';
import { HorizontalAlignmentTypes } from '../../../data/interface/Alignment';

const O34AlignmentTypes = Object.values(HorizontalAlignmentTypes).filter(
  (value) => value != HorizontalAlignmentTypes.END,
);

export default {
  title: 'NEOM/organism/O34 Boxed Card',
  component: require('./O34BoxedCard.lazy'),
  argTypes: {
    dark: {
      control: {
        type: 'boolean',
      },
      description: 'Toggle between normal and dark mode.',
    },
    align: {
      control: { type: 'radio', options: Object.values(O34AlignmentTypes) },
    },
    icon: {
      control: { type: 'text' },
    },
    heading: {
      control: {
        type: 'object',
      },
      description: 'A03 Heading component with hard-coded size and element props.',
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
    variant: {
      control: { type: 'radio', options: ['none', 'indexed'] },
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
    {{#if @root.dark}}<style>:root { --color-storybook-background: var(--color-black); }</style>{{/if}}
    <div style="{{#if @root.dark}}
      --boxed-card-background-color: transparent;
      --boxed-card-border-color: var(--color-black-75);
      --boxed-card-heading-color: var(--color-white);
      --boxed-card-hover-background-color: var(--color-real-black);
      --boxed-card-text-color: var(--color-white);
      --component-background-color: var(--color-black);
      --component-highlight-color: var(--color-gold);
      --component-text-color: var(--color-white);
      --icon-fill: var(--component-highlight-color);
      {{^}}
      --component-background-color: transparent;
      --component-highlight-color: var(--color-dark-gold);
      --component-text-color: var(--color-black);
      --icon-fill: var(--component-highlight-color);
      {{/if}}
      max-width:310px;margin:0 auto;">
        {{> o34-boxed-card @root }}
    </div></hbs>`,
});

Default.args = {
  ...O34Data,
  align: HorizontalAlignmentTypes.CENTER,
};

export const IndexedCTA = () => ({
  template: `<hbs>
    {{#if @root.dark}}<style>:root{--color-storybook-background:var(--color-black);}</style>{{/if}}
    <div style="{{#if @root.dark}}
      --boxed-card-background-color: transparent;
      --boxed-card-border-color: var(--color-black-75);
      --boxed-card-heading-color: var(--color-white);
      --boxed-card-hover-background-color: var(--color-real-black);
      --boxed-card-text-color: var(--color-white);
      --component-background-color: var(--color-black);
      --component-highlight-color: var(--color-gold);
      --component-text-color: var(--color-white);
      --icon-fill: var(--component-highlight-color);
      {{^}}
      --component-background-color: transparent;
      --component-highlight-color: var(--color-dark-gold);
      --component-text-color: var(--color-black);
      --icon-fill: var(--component-highlight-color);
      {{/if}}
      max-width:310px;margin:0 auto;">
        {{> o34-boxed-card @root }}
    </div></hbs>`,
});

IndexedCTA.args = {
  ...O34IndexedData,
};
