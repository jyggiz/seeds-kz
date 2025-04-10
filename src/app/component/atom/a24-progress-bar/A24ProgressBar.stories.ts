import { A24ProgressBarProps } from './A24ProgressBar.types';

export default {
  title: 'NEOM/atom/A24 Progress Bar',
  component: require('./A24ProgressBar'),
  argTypes: {
    dark: {
      control: {
        type: 'boolean',
      },
      description: 'Toggle between normal and dark mode.',
    },
    current: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      },
      description: '...',
    },
    loaded: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      },
      description: '...',
    },
    selected: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      },
      description: '...',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a progress bar.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
      {{#if @root.dark}}<style>:root{--color-storybook-background:var(--color-black);}</style>{{/if}}
      {{> a24-progress-bar @root}}
    </hbs>`,
});

const DefaultProps: A24ProgressBarProps = {
  current: 50,
  loaded: 0,
  selected: 0,
};

Default.args = DefaultProps;
